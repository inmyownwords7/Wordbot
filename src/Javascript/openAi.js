/*
import { OpenAIApi, Configuration } from "openai";
import { apiKey, org } from "../auth.js";

const configuration = new Configuration({
    organization: org,
    apiKey: apiKey,
});

 export const openAI = new OpenAIApi(configuration);

try {
    const completion = await openAI.createCompletion({
        model: "text-davinci-003",
        prompt: "Hello world",
    });
    console.log(completion.data.choices[0].text);
} catch (error) {
    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    } else {
        console.log(error.message);
    }
}
*/