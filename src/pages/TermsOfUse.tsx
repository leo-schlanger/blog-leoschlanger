import { FileText, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';

export function TermsOfUse() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('Termos de Uso', 'Terms of Use')}
        description={t(
          'Termos de uso e aviso legal do Leo.Blog — disclaimer financeiro e condições de uso.',
          'Leo.Blog terms of use and legal disclaimer — financial disclaimer and conditions of use.'
        )}
        url="/terms"
      />

      <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <FileText className="w-6 h-6 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('Termos de Uso', 'Terms of Use')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t('Última atualização: 12 de abril de 2026', 'Last updated: April 12, 2026')}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed">
            {/* Financial Disclaimer - highlighted */}
            <div className="cyber-card p-6 border border-yellow-500/40 bg-yellow-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-yellow-500">
                  {t('Aviso Legal Financeiro', 'Financial Disclaimer')}
                </h2>
              </div>
              <p className="font-medium">
                {t(
                  'O conteúdo publicado neste blog é exclusivamente para fins informativos e educacionais. Nenhuma informação apresentada aqui deve ser interpretada como recomendação de investimento, consultoria financeira, aconselhamento fiscal ou incentivo à compra ou venda de qualquer ativo financeiro, criptomoeda ou instrumento de investimento.',
                  'The content published on this blog is exclusively for informational and educational purposes. No information presented here should be interpreted as investment recommendation, financial advice, tax advice, or incentive to buy or sell any financial asset, cryptocurrency, or investment instrument.'
                )}
              </p>
              <p className="mt-3">
                {t(
                  'Investimentos em criptomoedas e mercados financeiros envolvem riscos significativos, incluindo a possibilidade de perda total do capital investido. Sempre consulte um profissional qualificado antes de tomar decisões financeiras. O autor não se responsabiliza por perdas ou danos decorrentes do uso das informações deste blog.',
                  'Investments in cryptocurrencies and financial markets involve significant risks, including the possibility of total loss of invested capital. Always consult a qualified professional before making financial decisions. The author is not responsible for losses or damages resulting from the use of information on this blog.'
                )}
              </p>
            </div>

            {/* Acceptance */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('1. Aceitação dos Termos', '1. Acceptance of Terms')}
              </h2>
              <p>
                {t(
                  'Ao acessar e utilizar o Leo.Blog ("blog", "site"), você concorda com estes Termos de Uso. Se você não concordar com algum dos termos aqui descritos, por favor, não utilize este site.',
                  'By accessing and using Leo.Blog ("blog", "site"), you agree to these Terms of Use. If you do not agree with any of the terms described here, please do not use this site.'
                )}
              </p>
            </div>

            {/* Nature of Content */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('2. Natureza do Conteúdo', '2. Nature of Content')}
              </h2>
              <p>
                {t(
                  'Este blog publica notícias, análises e comentários sobre criptomoedas, economia global, bancos centrais e mercados financeiros. O conteúdo é produzido a partir de fontes públicas e representa opiniões pessoais do autor. Não garantimos a exatidão, completude ou atualidade das informações publicadas.',
                  'This blog publishes news, analysis, and commentary on cryptocurrencies, global economy, central banks, and financial markets. Content is produced from public sources and represents the author\'s personal opinions. We do not guarantee the accuracy, completeness, or timeliness of published information.'
                )}
              </p>
              <p className="mt-3">
                {t(
                  'As fontes originais das notícias são sempre creditadas e linkadas. Encorajamos os leitores a verificarem as fontes primárias antes de tomarem qualquer decisão baseada no conteúdo deste blog.',
                  'Original news sources are always credited and linked. We encourage readers to verify primary sources before making any decisions based on the content of this blog.'
                )}
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('3. Propriedade Intelectual', '3. Intellectual Property')}
              </h2>
              <p>
                {t(
                  'Todo o conteúdo original deste blog, incluindo textos, design, código-fonte e logotipos, é de propriedade de Leo Schlanger e está protegido por leis de direitos autorais. Conteúdos de terceiros são devidamente creditados às suas fontes originais.',
                  'All original content on this blog, including text, design, source code, and logos, is the property of Leo Schlanger and is protected by copyright laws. Third-party content is properly credited to its original sources.'
                )}
              </p>
              <p className="mt-3">
                {t(
                  'É permitido compartilhar links para o conteúdo do blog. A reprodução parcial é permitida desde que com atribuição adequada e link para a publicação original.',
                  'Sharing links to blog content is permitted. Partial reproduction is allowed provided proper attribution and a link to the original publication are included.'
                )}
              </p>
            </div>

            {/* Market Data */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('4. Dados de Mercado', '4. Market Data')}
              </h2>
              <p>
                {t(
                  'Os dados de mercado exibidos neste blog (preços de criptomoedas, índices, indicadores) são obtidos de fontes de terceiros e podem apresentar atraso. Esses dados são fornecidos "como estão" e não devem ser utilizados como base única para decisões de investimento.',
                  'Market data displayed on this blog (cryptocurrency prices, indices, indicators) is obtained from third-party sources and may be delayed. This data is provided "as is" and should not be used as the sole basis for investment decisions.'
                )}
              </p>
            </div>

            {/* Affiliate Links */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('5. Links de Afiliados e Divulgação', '5. Affiliate Links and Disclosure')}
              </h2>
              <p>
                {t(
                  'Este blog contém links de afiliados/referral para os seguintes serviços:',
                  'This blog contains affiliate/referral links for the following services:'
                )}
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <span className="text-white font-medium">Hyperliquid</span>
                  {t(' — Exchange descentralizada de futuros perpétuos', ' — Decentralized perpetual futures exchange')}
                </li>
                <li>
                  <span className="text-white font-medium">Ledger</span>
                  {t(' — Carteira de hardware para criptomoedas', ' — Hardware wallet for cryptocurrencies')}
                </li>
                <li>
                  <span className="text-white font-medium">Hostinger</span>
                  {t(' — Serviço de hospedagem web', ' — Web hosting service')}
                </li>
              </ul>
              <p className="mt-3">
                {t(
                  'Quando você utiliza esses links, o autor pode receber uma comissão ou benefício sem custo adicional para você. A inclusão desses links não influencia o conteúdo editorial do blog. Recomendamos apenas ferramentas que o autor utiliza pessoalmente.',
                  'When you use these links, the author may receive a commission or benefit at no additional cost to you. The inclusion of these links does not influence the blog\'s editorial content. We only recommend tools that the author personally uses.'
                )}
              </p>
            </div>

            {/* External Links */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('6. Links Externos', '6. External Links')}
              </h2>
              <p>
                {t(
                  'Este blog contém links para sites de terceiros. Não temos controle sobre o conteúdo ou as práticas de privacidade desses sites e não nos responsabilizamos por eles. Acessar links externos é por sua conta e risco.',
                  'This blog contains links to third-party websites. We have no control over the content or privacy practices of those sites and are not responsible for them. Accessing external links is at your own risk.'
                )}
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('7. Limitação de Responsabilidade', '7. Limitation of Liability')}
              </h2>
              <p>
                {t(
                  'Na máxima extensão permitida pela legislação aplicável, o autor e operador deste blog não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou especiais decorrentes do uso ou impossibilidade de uso deste site ou de informações nele contidas.',
                  'To the maximum extent permitted by applicable law, the author and operator of this blog shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use or inability to use this site or information contained therein.'
                )}
              </p>
            </div>

            {/* Availability */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('8. Disponibilidade do Serviço', '8. Service Availability')}
              </h2>
              <p>
                {t(
                  'Não garantimos que o blog estará disponível de forma ininterrupta ou livre de erros. Reservamos o direito de modificar, suspender ou descontinuar o blog, total ou parcialmente, a qualquer momento e sem aviso prévio.',
                  'We do not guarantee that the blog will be available uninterrupted or error-free. We reserve the right to modify, suspend, or discontinue the blog, in whole or in part, at any time without prior notice.'
                )}
              </p>
            </div>

            {/* Governing Law */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('9. Legislação Aplicável', '9. Governing Law')}
              </h2>
              <p>
                {t(
                  'Estes termos são regidos pelas leis da República Federativa do Brasil. Para visitantes localizados na União Europeia, aplicam-se também as disposições obrigatórias do GDPR e da legislação local de proteção ao consumidor do seu país de residência.',
                  'These terms are governed by the laws of the Federative Republic of Brazil. For visitors located in the European Union, the mandatory provisions of the GDPR and local consumer protection legislation of your country of residence also apply.'
                )}
              </p>
            </div>

            {/* Changes */}
            <div className="cyber-card p-6 border border-cyber-green/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                {t('10. Alterações nos Termos', '10. Changes to Terms')}
              </h2>
              <p>
                {t(
                  'Reservamos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação nesta página. A data da última atualização é indicada no topo desta página. O uso continuado do site após alterações constitui aceitação dos novos termos.',
                  'We reserve the right to modify these terms at any time. Changes take effect immediately upon publication on this page. The date of the last update is indicated at the top of this page. Continued use of the site after changes constitutes acceptance of the new terms.'
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
                  'Para dúvidas sobre estes termos, entre em contato através do nosso ',
                  'For questions about these terms, please contact us through our '
                )}
                <a href="https://leoschlanger.com/#/contact" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:underline">
                  {t('formulário de contato', 'contact form')}
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
