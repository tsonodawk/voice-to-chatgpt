import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

// 発行したAPI Keyを使って設定を定義
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  // GPTに送るメッセージを取得
  // const message = req.body.message
  const question = req.body.question
  console.log(req.body.question)

  if (!question) return

  try {
    // 設定を諸々のせてAPIとやり取り
    // const completion = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages: message,
    //   temperature: 0.9,
    //   max_tokens: 100,
    // })
    // res.status(200).json({ result: completion.data.choices[0].message })

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    })
    console.log('データ取得')
    // GPTの返答を取得
    const answer = completion.data.choices[0].message?.content

    res.status(200).json({ answer })
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      })
    }
  }
  // if (req.method === 'POST') {
  //   const { question } = req.body

  //   try {
  //     const response = await openai.Completion.create({
  //       engine: 'davinci-codex',
  //       prompt: question,
  //       max_tokens: 100,
  //       n: 1,
  //       stop: null,
  //       temperature: 0.7,
  //     })

  //     const answer = response.choices[0].text.trim()
  //     res.status(200).json({ answer })
  //   } catch (error) {
  //     console.error(error)
  //     res.status(500).json({ message: 'Error getting response from ChatGPT' })
  //   }
  // } else {
  //   res.status(405).json({ message: 'Only POST requests are allowed' })
  // }
}
