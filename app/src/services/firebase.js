// https://firebase.google.com/docs/web/setup#available-libraries
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const fs = require("fs");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function uploadPicture(picture) {
  return new Promise((resolve, reject) => {
    const filename = picture.destination + picture.filename;
    const storageRef = ref(storage, filename);
    const file = fs.readFileSync(filename);

    console.log({ storageRef, filename, file });

    try {
      uploadBytes(storageRef, file)
        .then(() => {
          console.log("Upload de arquivo no Firebase Storage executado com sucesso.");
        })
        .then(async () => {
          const url = await getDownloadURL(storageRef);
          console.log("URL de arquivo no Firebase Storage obtida com sucesso.");
          return url;
        })
        .then((url) => {
          // Remover o arquivo de imagem do armazenamento local (executada sem callback)
          // A falha na remoção local não deve impactar o fluxo de upload de imagem
          // Nesse ponto, a imagem já foi enviada e a URL já foi adquirida, prosseguir
          console.log("Removendo imagem do armazenamento local.");
          fs.unlink(filename, () => {});
          return url;
        })
        .then((url) => {
          resolve(url);
        });
    } catch (error) {
      console.log(`Falha no envio de arquivo para o Firebase Storage: ${error.message}`);

      // Em caso de falha no envio para o Firebase, tentar remover o arquivo do armazenamento local
      // Também executada de maneira assíncrona, a falha dessa operação não deve impactar o fluxo final
      fs.unlink(filename, () => {});

      reject(error);
    }
  });
}

function deletePicure(path) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);

    deleteObject(storageRef)
      .then(() => {
        console.log("Arquivo removido com sucesso do Firebase Storage.");
        resolve();
      })
      .catch((error) => {
        console.log(`Erro ao remover arquivo do Firebase Storage: ${error.message}`);
        reject(error);
      });
  });
}

function extractPathFromURL(url) {
  // A expressão regular aplicada irá separar a URL em três partes
  // Os delimitadores são os trechos "/o/" e "?alt", que delimitam o caminho do arquivo

  // - A primeira parte irá conter o início da URL
  // - A segunda parte irá conter o caminho do arquivo
  // - A terceira parte irá conter parâmetros de query e também o token de acesso da imagem

  // Regex extraída de:
  // https://stackoverflow.com/questions/6109882/regex-match-all-characters-between-two-strings

  if (url) {
    if (url.includes("https://firebasestorage.googleapis.com")) {
      const path = url.split(/(?<=\/o\/)(.*)(?=\?alt)/)[1];

      return path.replaceAll("%2F", "/");
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = { uploadPicture, deletePicure, extractPathFromURL };
