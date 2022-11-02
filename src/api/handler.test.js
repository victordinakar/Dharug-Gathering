import { assert } from "console";
import { docId, addWord, deleteWord } from "./handler";
it("Adding the word", async () => {
  const actualWord = {
    dharug_language: "hola",
    english_language: "hello",
    category: "Elements",
    id: 4568,
  };
  await addWord(actualWord).then((resp) => {
    console.log(resp);
  });
});

it("Deleting the word", async () => {
  await deleteWord(docId).then((resp) => {
    console.log(resp);
  });
});
