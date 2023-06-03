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
  const message = `There are only '육류', '과일', '채소', '음료', '수산물', '반찬', '조미료', '가공식품' categories in the world. Please choose which category '${keyword}' belongs to. If nothing belongs to this, say '기타'. You should tell me in only Korean, Don't ever speak English and follow this rule, {category}`;

  let answer = "";
  let categories = [];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    temperature: 0,
  });

  if (response.data) {
    if (response.data.choices) answer = response.data.choices[0].message.content;
    else answer = null;
  }
  categories.push(answer);
  callback(null, { categories: categories });
};
