# Amor em Papel — Estúdio de Fotos V2.2

## Uso no painel de produtos
A área **Admin > Produtos** tem miniaturas por produto, indicação de foto de capa e ações:
1. Clique em **Adicionar foto** e escolha um JPG, PNG ou WebP autorizado.
2. A imagem é processada no próprio navegador: largura/altura máximas de 1600 px, limite de até 2 MB de saída, WebP quando suportado. A prévia permite conferir recorte e nitidez **antes** de enviar.
3. Clique **Confirmar envio**; o arquivo vai ao Supabase Storage (bucket `product-media`), e uma linha `product_images` registra a foto. A primeira imagem passa a ser capa automaticamente.
4. Use **Capa** para escolher a foto exibida primeiro na vitrine. Use **Excluir** para remover uma foto individual.
5. Excluir produto remove primeiro o registro do produto e depois tenta remover as fotos dele do Storage. Falhas de limpeza são informadas na interface.

## Política de otimização e privacidade
- Entrada: JPG, PNG ou WebP, até 12 MB e 25 milhões de pixels.
- Saída: máximo 1600 px no maior lado e 2 MB; o navegador comprime antes do upload.
- SVG, GIF e HEIC são rejeitados, sem fingir que foram convertidos.
- Se WebP não estiver disponível, usar JPEG (ou PNG quando o arquivo original possui transparência).
- Nenhuma imagem é enviada automaticamente ao selecionar: requer confirmação.
- Prévia local usa URL temporária que é revogada ao fechar ou trocar.
- Não gravar imagens ou dados da cliente em repositório público sem autorização.
- Não inventar fotos, avaliações, descontos nem preços.

## Resiliência e segurança
- Se upload ao Storage falhar, não inserir metadados.
- Se inserir metadados falhar depois de upload, tentar excluir o objeto para evitar arquivos órfãos.
- Se exclusão no Storage falhar depois de remover o registro, a UI alerta a necessidade de limpeza manual.
- Cada ação mostra estado/erro; outras alterações de foto ficam bloqueadas enquanto existe upload/exclusão em andamento.
- As permissões continuam aplicadas no Supabase por RLS; o frontend não usa `service_role`.

## Antes de lançar em produção
1. Criar Supabase e aplicar migrações na ordem, inclusive a **0004** dos pedidos.
2. Confirmar Auth/admin e políticas de Storage com conta autorizada e visitante.
3. Enviar imagens reais e testar *Capa*, *Excluir*, falha de upload/metadata e a prévia em celular real.
4. Confirmar que produtos ativos aparecem com as fotos certas em Home, categoria e detalhe. Conferir a ordenação `sort_order`.
5. Verificar uso real do Storage no dashboard Supabase (o painel exibe quantidade de fotos, **não** a franquia do plano).
6. Fazer `npm run typecheck`, `npm run test:unit`, `npm run build` e `npm run test:e2e` antes de mudar o Cloudflare.

**Limitação:** testes locais e GitHub CI verificam o código, mas não provam as permissões nem quotas de uma instância Supabase ainda não conectada.
