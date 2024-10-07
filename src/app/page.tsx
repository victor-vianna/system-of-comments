import React from "react";

const ChatComponent = () => {
  return (
    <div className="flex h-full w-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 border-b pb-4">
        <h1 className="text-2xl font-bold"># Chat</h1>
        <p className="text-sm text-gray-600">
          Este é o início da conversa no{" "}
          <span className="font-bold">#Chat</span>. Fique à vontade para
          convidar seus colegas de equipe e iniciar a discussão.
        </p>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="flex items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
              W
            </div>
            <span className="ml-2">
              Criado por: <strong>Victor Vianna</strong>
            </span>
          </div>
          <span className="ml-4">Criado em: setembro 26 2024</span>
        </div>
      </div>

      {/* Chat Input */}
      <div className="mt-auto">
        <textarea
          placeholder="Comente ou digite '/' para acionar comandos e ações da IA"
          className="h-20 w-full resize-none rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
