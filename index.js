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
  const message = `Choose the category of '${keyword}' belongs to among '육류', '과일', '채소', '음료', '수산물', '반찬', '간식', '조미료', '가공식품', 'etc' up to 2.  You should follow this rule: if only one category -> "word", if two category -> "word#word".`;
  let answer = "";
  let categories = [];
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0,
    max_tokens: 700,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  if (response.data) {
    if (response.data.choices) answer = response.data.choices[0].text;
    else answer = null;
  }
  if (answer != null) {
    answer = answer.replace('\n\n', '');
    categories = answer.split('#');
    categories.forEach(function (item, index, arr) {
      if (item === 'etc') arr[index] = '기타';
    })
  }
  callback(null, { categories: categories });
};
