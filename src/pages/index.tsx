import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post("/api/chatgpt", { question });
      const resAnswer = res.data.answer;
      setAnswer(resAnswer)

      const speech = new SpeechSynthesisUtterance(resAnswer);
      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
          placeholder="質問を入力してください"
        />
        <button type="submit" disabled={loading}>
          {loading ? "読み込み中..." : "送信"}
        </button>
      </form>
      <p style={{whiteSpace: 'pre-wrap'}}>{answer}</p>
    </div>
  );
}
