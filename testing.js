const text = "[/*@Lucas Fernandes*/], tudo certo?";

const splitted = text.split(/(\[\/\*.*?\*\/\])/);
splitted.filter((s) => s.trim().length > 0).map((s) => console.log(s));
