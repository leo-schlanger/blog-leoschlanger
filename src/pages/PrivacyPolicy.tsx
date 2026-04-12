import { Shield } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';

export function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('Política de Privacidade', 'Privacy Policy')}
        description={t(
          'Política de privacidade do Leo.Blog — como tratamos seus dados pessoais conforme LGPD e GDPR.',
          'Leo.Blog privacy policy — how we handle your personal data under LGPD and GDPR.'
        )}
        url="/privacy"
      />

      <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <Shield className="w-6 h-6 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('Política de Privacidade', 'Privacy Policy')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t('Última atualização: 12 de abril de 2026', 'Last updated: April 12, 2026')}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* Introduction */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('1. Introdução', '1. Introduction')}
              </h2>
              <p>
                {t(
                  'Bem-vindo ao Leo.Blog ("blog", "site", "nós"). Este blog é operado por Leo Schlanger como um projeto pessoal. Respeitamos sua privacidade e estamos comprometidos com a proteção dos seus dados pessoais. Esta política descreve como coletamos, usamos e protegemos suas informações, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) do Brasil e o Regulamento Geral sobre a Proteção de Dados (GDPR - Regulamento UE 2016/679) da União Europeia.',
                  'Welcome to Leo.Blog ("blog", "site", "we"). This blog is operated by Leo Schlanger as a personal project. We respect your privacy and are committed to protecting your personal data. This policy describes how we collect, use, and protect your information, in compliance with Brazil\'s General Data Protection Law (LGPD - Law No. 13.709/2018) and the European Union\'s General Data Protection Regulation (GDPR - Regulation EU 2016/679).'
                )}
              </p>
            </div>

            {/* Data Controller */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('2. Controlador de Dados', '2. Data Controller')}
              </h2>
              <p>
                {t(
                  'O controlador dos dados pessoais tratados por este site é:',
                  'The controller of personal data processed by this site is:'
                )}
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('Nome: Leo Schlanger', 'Name: Leo Schlanger')}</li>
                <li>
                  {t('Contato: ', 'Contact: ')}
                  <a href="https://leoschlanger.com/#/contact" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                    leoschlanger.com/contact
                  </a>
                </li>
                <li>Site: blog.leoschlanger.com</li>
              </ul>
            </div>

            {/* Data We Collect */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('3. Dados que Coletamos', '3. Data We Collect')}
              </h2>
              <p className="mb-3">
                {t(
                  'Este blog coleta o mínimo de dados possível. Abaixo estão os dados que podem ser processados:',
                  'This blog collects minimal data. Below are the data that may be processed:'
                )}
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('3.1 Armazenamento Local (localStorage)', '3.1 Local Storage (localStorage)')}
              </h3>
              <p>
                {t(
                  'Armazenamos sua preferência de idioma (português ou inglês) no localStorage do seu navegador. Esta informação permanece exclusivamente no seu dispositivo e não é transmitida para nenhum servidor.',
                  'We store your language preference (Portuguese or English) in your browser\'s localStorage. This information remains exclusively on your device and is not transmitted to any server.'
                )}
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('3.2 Dados de Navegação', '3.2 Navigation Data')}
              </h3>
              <p>
                {t(
                  'Não utilizamos serviços de analytics, rastreamento, cookies de terceiros ou pixels de rastreamento. Não coletamos dados como endereço IP, localização geográfica ou comportamento de navegação.',
                  'We do not use analytics services, tracking, third-party cookies, or tracking pixels. We do not collect data such as IP address, geographic location, or browsing behavior.'
                )}
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('3.3 Formulários e Coleta Direta', '3.3 Forms and Direct Collection')}
              </h3>
              <p>
                {t(
                  'Este blog não possui formulários de contato, cadastro, newsletter, sistema de comentários ou qualquer outro mecanismo de coleta direta de dados pessoais.',
                  'This blog does not have contact forms, registration, newsletter, comment system, or any other mechanism for direct collection of personal data.'
                )}
              </p>
            </div>

            {/* Third-party Services */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('4. Serviços de Terceiros', '4. Third-Party Services')}
              </h2>
              <p className="mb-3">
                {t(
                  'Integramos os seguintes serviços de terceiros que podem processar dados de acordo com suas próprias políticas de privacidade:',
                  'We integrate the following third-party services that may process data according to their own privacy policies:'
                )}
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('4.1 Supabase', '4.1 Supabase')}
              </h3>
              <p>
                {t(
                  'Utilizamos o Supabase como banco de dados para armazenar o conteúdo do blog (posts, categorias, tags). Nenhum dado pessoal dos visitantes é armazenado no Supabase.',
                  'We use Supabase as a database to store blog content (posts, categories, tags). No personal data from visitors is stored in Supabase.'
                )}
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('4.2 TradingView', '4.2 TradingView')}
              </h3>
              <p>
                {t(
                  'O widget de calendário econômico do TradingView é incorporado na página de ferramentas. O TradingView pode coletar dados conforme sua própria política de privacidade. Recomendamos consultar: ',
                  'The TradingView economic calendar widget is embedded in the tools page. TradingView may collect data according to its own privacy policy. We recommend reviewing: '
                )}
                <a href="https://www.tradingview.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                  tradingview.com/privacy-policy
                </a>
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('4.3 GitHub Pages', '4.3 GitHub Pages')}
              </h3>
              <p>
                {t(
                  'Este site é hospedado no GitHub Pages. O GitHub pode coletar informações técnicas dos visitantes (como endereço IP) para fins operacionais. Consulte: ',
                  'This site is hosted on GitHub Pages. GitHub may collect technical information from visitors (such as IP address) for operational purposes. See: '
                )}
                <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                  GitHub Pages Data Collection
                </a>
              </p>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('4.4 PayPal', '4.4 PayPal')}
              </h3>
              <p>
                {t(
                  'Disponibilizamos um botão de doação via PayPal. Ao clicar, você será redirecionado para o site do PayPal, que processa seus dados conforme sua própria política de privacidade.',
                  'We provide a donation button via PayPal. By clicking, you will be redirected to PayPal\'s website, which processes your data according to its own privacy policy.'
                )}
              </p>
            </div>

            {/* Legal Basis */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('5. Base Legal para o Tratamento (LGPD & GDPR)', '5. Legal Basis for Processing (LGPD & GDPR)')}
              </h2>
              <p>
                {t(
                  'O tratamento de dados neste site é baseado nas seguintes bases legais:',
                  'Data processing on this site is based on the following legal bases:'
                )}
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  <span className="text-white font-medium">{t('Interesse legítimo', 'Legitimate interest')}</span>
                  {t(
                    ' (Art. 7º, IX da LGPD / Art. 6(1)(f) do GDPR): para a operação técnica do site e entrega de conteúdo.',
                    ' (Art. 7, IX of LGPD / Art. 6(1)(f) of GDPR): for the technical operation of the site and content delivery.'
                  )}
                </li>
                <li>
                  <span className="text-white font-medium">{t('Consentimento', 'Consent')}</span>
                  {t(
                    ' (Art. 7º, I da LGPD / Art. 6(1)(a) do GDPR): quando você interage voluntariamente com serviços de terceiros (como PayPal ou links de afiliados).',
                    ' (Art. 7, I of LGPD / Art. 6(1)(a) of GDPR): when you voluntarily interact with third-party services (such as PayPal or affiliate links).'
                  )}
                </li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('6. Seus Direitos', '6. Your Rights')}
              </h2>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('6.1 Direitos sob a LGPD (Brasil)', '6.1 Rights under LGPD (Brazil)')}
              </h3>
              <p className="mb-2">
                {t(
                  'Conforme a LGPD, você tem direito a:',
                  'Under the LGPD, you have the right to:'
                )}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('Confirmação da existência de tratamento', 'Confirmation of the existence of processing')}</li>
                <li>{t('Acesso aos dados', 'Access to data')}</li>
                <li>{t('Correção de dados incompletos, inexatos ou desatualizados', 'Correction of incomplete, inaccurate, or outdated data')}</li>
                <li>{t('Anonimização, bloqueio ou eliminação de dados', 'Anonymization, blocking, or deletion of data')}</li>
                <li>{t('Portabilidade dos dados', 'Data portability')}</li>
                <li>{t('Eliminação dos dados tratados com consentimento', 'Deletion of data processed with consent')}</li>
                <li>{t('Informação sobre compartilhamento de dados', 'Information about data sharing')}</li>
                <li>{t('Revogação do consentimento', 'Revocation of consent')}</li>
              </ul>

              <h3 className="text-white font-medium mt-4 mb-2">
                {t('6.2 Direitos sob o GDPR (União Europeia)', '6.2 Rights under GDPR (European Union)')}
              </h3>
              <p className="mb-2">
                {t(
                  'Se você está localizado no Espaço Econômico Europeu (EEE), você tem os seguintes direitos adicionais:',
                  'If you are located in the European Economic Area (EEA), you have the following additional rights:'
                )}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('Direito de acesso (Art. 15 GDPR)', 'Right of access (Art. 15 GDPR)')}</li>
                <li>{t('Direito de retificação (Art. 16 GDPR)', 'Right to rectification (Art. 16 GDPR)')}</li>
                <li>{t('Direito ao apagamento / "direito de ser esquecido" (Art. 17 GDPR)', 'Right to erasure / "right to be forgotten" (Art. 17 GDPR)')}</li>
                <li>{t('Direito à limitação do tratamento (Art. 18 GDPR)', 'Right to restriction of processing (Art. 18 GDPR)')}</li>
                <li>{t('Direito à portabilidade dos dados (Art. 20 GDPR)', 'Right to data portability (Art. 20 GDPR)')}</li>
                <li>{t('Direito de oposição (Art. 21 GDPR)', 'Right to object (Art. 21 GDPR)')}</li>
                <li>{t('Direito de apresentar reclamação junto a uma autoridade supervisora', 'Right to lodge a complaint with a supervisory authority')}</li>
              </ul>
            </div>

            {/* International Transfers */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('7. Transferências Internacionais de Dados', '7. International Data Transfers')}
              </h2>
              <p>
                {t(
                  'Os serviços de terceiros mencionados nesta política (GitHub, Supabase, TradingView, PayPal) podem processar dados em servidores localizados fora do Brasil e/ou do Espaço Econômico Europeu. Essas transferências são realizadas com base nas garantias adequadas previstas na LGPD (Art. 33) e no GDPR (Art. 46), incluindo cláusulas contratuais padrão e decisões de adequação.',
                  'The third-party services mentioned in this policy (GitHub, Supabase, TradingView, PayPal) may process data on servers located outside Brazil and/or the European Economic Area. These transfers are carried out based on adequate safeguards provided for in the LGPD (Art. 33) and the GDPR (Art. 46), including standard contractual clauses and adequacy decisions.'
                )}
              </p>
            </div>

            {/* Data Security */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('8. Segurança dos Dados', '8. Data Security')}
              </h2>
              <p>
                {t(
                  'Adotamos medidas técnicas e organizacionais para proteger os dados processados por este site, incluindo o uso de HTTPS para todas as comunicações e a minimização da coleta de dados.',
                  'We adopt technical and organizational measures to protect data processed by this site, including the use of HTTPS for all communications and data collection minimization.'
                )}
              </p>
            </div>

            {/* Children */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('9. Menores de Idade', '9. Children')}
              </h2>
              <p>
                {t(
                  'Este blog não é direcionado a menores de 18 anos e não coleta intencionalmente dados de crianças ou adolescentes. O conteúdo sobre mercados financeiros e criptomoedas é destinado a um público adulto.',
                  'This blog is not directed at individuals under 18 years of age and does not intentionally collect data from children or adolescents. Content about financial markets and cryptocurrencies is intended for an adult audience.'
                )}
              </p>
            </div>

            {/* Changes */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('10. Alterações nesta Política', '10. Changes to This Policy')}
              </h2>
              <p>
                {t(
                  'Podemos atualizar esta política periodicamente. A data da última atualização será sempre exibida no topo desta página. Recomendamos revisar esta política regularmente.',
                  'We may update this policy periodically. The date of the last update will always be displayed at the top of this page. We recommend reviewing this policy regularly.'
                )}
              </p>
            </div>

            {/* Contact */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('11. Contato', '11. Contact')}
              </h2>
              <p>
                {t(
                  'Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato através do nosso ',
                  'To exercise your rights or clarify questions about this policy, please contact us through our '
                )}
                <a href="https://leoschlanger.com/#/contact" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                  {t('formulário de contato', 'contact form')}
                </a>.
              </p>
              <p className="mt-2">
                {t(
                  'Se você está na União Europeia e acredita que seus dados não foram tratados adequadamente, você tem o direito de apresentar uma reclamação junto à autoridade de proteção de dados do seu país.',
                  'If you are in the European Union and believe your data has not been handled properly, you have the right to lodge a complaint with the data protection authority in your country.'
                )}
              </p>
              <p className="mt-2">
                {t(
                  'Se você está no Brasil, pode entrar em contato com a Autoridade Nacional de Proteção de Dados (ANPD) em ',
                  'If you are in Brazil, you can contact the National Data Protection Authority (ANPD) at '
                )}
                <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                  gov.br/anpd
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
