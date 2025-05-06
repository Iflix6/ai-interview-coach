import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface QuestionDisplayProps {
  question: string
  questionNumber: number
  totalQuestions: number
}

export default function QuestionDisplay({ question, questionNumber, totalQuestions }: QuestionDisplayProps) {
  const progressPercentage = (questionNumber / totalQuestions) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>Current Question</span>
          <span className="text-sm font-normal text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
        </CardTitle>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-lg font-medium">{question}</p>
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Speak clearly and take your time to answer this question thoroughly.</p>
        </div>
      </CardContent>
    </Card>
  )
}
