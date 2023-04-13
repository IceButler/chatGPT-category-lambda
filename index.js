const dotenv = require("dotenv");
const OpenAI = require("openai");
const axios = require("axios");
dotenv.config();

const { Configuration, OpenAIApi } = OpenAI;

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context, callback) => {
  const { keyword } = event;
  const message = `'${keyword}'은 반찬, 간식, 식재료, 기타 중 어느 카테고리?`;
  let category = "";
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 4000,
    temperature: 0,
  });
  if (response.data) {
    if (response.data.choices) category = response.data.choices[0].text;
    else category = "기타";
  }
  callback(null, { category: category });
};

function getOneWord(text) {
  if (text) {
    let startIndex = text.indexOf('"');
    let lastIndex = text.lastIndexOf('"');
    return text.substring(startIndex + 1, lastIndex);
  }
}
