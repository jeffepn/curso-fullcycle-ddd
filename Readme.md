## Implementação dos testes do OrderRepository 
Esta etapa, consiste na implementação dos métodos e testes do repository(OrderRepository), que a interface OrderRepositoryInterface, obriga-o a implementar.

## Executar os testes


```bash
# Executar todos os testes
npm run test

# Executar em modo watch, para reexecução a cada alteração do código
npm run test:watch
```


_Caso não tenha o npm instalado em sua máquina, use uma imagem docker padrão para a execução_
```bash
# Executar todos os testes
docker run --rm -it -v $(pwd):/app -w /app node npm run test

# Executar em modo watch, para reexecução a cada alteração do código
docker run --rm -it -v $(pwd):/app -w /app node npm run test:watch
```