
const CACHE_NAME = "como-posso-ajudar-v6";

const FICHEIROS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/style.css",
  "./src/app.js",
  "./src/educacao.html",
  "./src/emprego.html",
  "./src/saude.html",
  "./src/financas.html",
  "./src/servicos.html",
  "./src/ajuda.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Guardar os ficheiros necessários para o modo offline
self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(FICHEIROS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

// Ativar a nova versão e limpar caches antigas
self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys()
      .then(function (nomes) {
        return Promise.all(
          nomes
            .filter(function (nome) {
              return nome !== CACHE_NAME;
            })
            .map(function (nome) {
              return caches.delete(nome);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// Consultar a rede e recorrer à cache quando necessário
self.addEventListener("fetch", function (evento) {
  const pedido = evento.request;

  if (pedido.method !== "GET") {
    return;
  }

  const url = new URL(pedido.url);

  // Não interferir com pedidos a outros sites
  if (url.origin !== self.location.origin) {
    return;
  }

  evento.respondWith(
    fetch(pedido)
      .then(function (resposta) {
        if (resposta.ok) {
          const copia = resposta.clone();

          caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(pedido, copia);
            });
        }

        return resposta;
      })
      .catch(function () {
        return caches.match(pedido).then(function (guardado) {
          if (guardado) {
            return guardado;
          }

          // Só usar a página inicial como último recurso
          // para pedidos de navegação
          if (pedido.mode === "navigate") {
            return caches.match("./index.html");
          }

          return new Response(
            "Este conteúdo não está disponível offline.",
            {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            }
          );
        });
      })
  );
});
