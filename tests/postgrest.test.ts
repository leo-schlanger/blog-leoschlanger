import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fillMissingTranslations } from '../src/lib/translation';
import { ilikeContains, isValidSlug, sanitizeSearchTerm, tagContainsPattern } from '../src/lib/postgrest';

test('isValidSlug aceita kebab-case ASCII', () => {
  assert.equal(isValidSlug('fed-mantem-taxas-2026'), true);
  assert.equal(isValidSlug('bitcoin'), true);
});

test('isValidSlug aceita slugs truncados pelo pipeline (hífen no fim)', () => {
  // Casos reais de produção: corte em 100 caracteres
  assert.equal(isValidSlug('a-diferenca-entre-cycles-como-a-australia-navega-das-taxas-de-'), true);
  assert.equal(isValidSlug('a--b'), true);
});

test('isValidSlug rejeita sintaxe PostgREST e caminhos', () => {
  for (const slug of ['', 'a,b', 'x),status.eq.draft', '../etc/passwd', 'a/b', 'a.b', 'Fed', 'a b', 'ação', 'a"b', 'a:b']) {
    assert.equal(isValidSlug(slug), false, slug);
  }
  assert.equal(isValidSlug('a'.repeat(301)), false);
});

test('sanitizeSearchTerm remove caracteres reservados e curingas', () => {
  assert.equal(sanitizeSearchTerm('fed, juros'), 'fed juros');
  assert.equal(sanitizeSearchTerm('a),status.eq.draft'), 'a status.eq.draft');
  assert.equal(sanitizeSearchTerm('100% *btc_etf*'), '100 btc etf');
  assert.equal(sanitizeSearchTerm('"aspas" \\barra'), 'aspas barra');
  assert.equal(sanitizeSearchTerm('  inflação   EUA  '), 'inflação EUA');
  assert.equal(sanitizeSearchTerm("S&P 500 $BTC d'Or"), "S P 500 $BTC d'Or");
});

test('sanitizeSearchTerm limita o tamanho', () => {
  assert.equal(sanitizeSearchTerm('x'.repeat(500)).length, 100);
});

test('ilikeContains envolve o termo em aspas e curingas', () => {
  assert.equal(ilikeContains('fed juros'), '"%fed juros%"');
});

test('tagContainsPattern casa a tag inteira no JSON', () => {
  assert.equal(tagContainsPattern('fed'), '%"fed"%');
  assert.equal(tagContainsPattern(' bitcoin '), '%"bitcoin"%');
});

test('tagContainsPattern reproduz o ensure_ascii do Python', () => {
  // json.dumps(["inflação"]) == '["infla\\u00e7\\u00e3o"]'
  assert.equal(tagContainsPattern('inflação'), '%"infla\\\\u00e7\\\\u00e3o"%');
});

test('tagContainsPattern escapa curingas de LIKE', () => {
  assert.equal(tagContainsPattern('interest_rates'), '%"interest\\_rates"%');
});

test('tagContainsPattern rejeita entradas perigosas', () => {
  for (const tag of ['', 'a%b', 'a"b', 'a,b', 'a(b)', 'x'.repeat(51)]) {
    assert.equal(tagContainsPattern(tag), null, tag);
  }
});

test('fillMissingTranslations usa o outro idioma quando falta tradução', () => {
  const post = fillMissingTranslations({
    id: 1,
    title_pt: 'Título', title_en: '',
    slug_pt: 'atencao-aos-efeitos', slug_en: '',
    summary_pt: '', summary_en: 'Summary',
    content_pt: 'Texto', content_en: '  ',
  });
  assert.equal(post.slug_en, 'atencao-aos-efeitos');
  assert.equal(post.title_en, 'Título');
  assert.equal(post.summary_pt, 'Summary');
  assert.equal(post.content_en, 'Texto');
  assert.equal(post.id, 1);
});
