"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, CheckCircle2, Calendar } from "lucide-react"
import { useState } from "react"
import { markBingoSquare } from "@/actions/challenges"
import { useRouter } from "next/navigation"

interface BingoCardProps {
  bingoCard: {
    id: string
    name: string
    season: string
    year: number
    squares: string
    startDate: Date
    endDate: Date
    userCard: {
      id: string
      markedSquares: string
      completedAt: Date | null
    } | null
  }
}

interface BingoSquare {
  text: string
  type?: string
}

export function BingoCard({ bingoCard }: BingoCardProps) {
  const router = useRouter()
  const squares: BingoSquare[] = JSON.parse(bingoCard.squares || "[]")
  const markedSquares: number[] = JSON.parse(bingoCard.userCard?.markedSquares || "[]")
  const [selectedSquares, setSelectedSquares] = useState<number[]>(markedSquares)
  const [isLoading, setIsLoading] = useState(false)

  const gridSize = Math.sqrt(squares.length)
  const grid = []
  for (let i = 0; i < gridSize; i++) {
    grid.push(squares.slice(i * gridSize, (i + 1) * gridSize))
  }

  const handleSquareClick = async (index: number) => {
    setIsLoading(true)
    try {
      const result = await markBingoSquare(bingoCard.id, index)
      setSelectedSquares(result.markedSquares)
      if (result.hasBingo) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to mark square:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeRemaining = new Date(bingoCard.endDate).getTime() - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  return (
    <Card className={bingoCard.userCard?.completedAt ? "border-primary/50 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{bingoCard.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{bingoCard.season} {bingoCard.year}</span>
              <span>•</span>
              <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Ended"}</span>
            </div>
          </div>
          {bingoCard.userCard?.completedAt && (
            <Badge variant="default" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Completed!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-2 p-2 border rounded-lg bg-muted/30"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const index = rowIndex * gridSize + colIndex
              const isMarked = selectedSquares.includes(index)

              return (
                <button
                  key={index}
                  onClick={() => handleSquareClick(index)}
                  disabled={isLoading || !!bingoCard.userCard?.completedAt}
                  className={`
                    aspect-square p-2 text-xs font-medium rounded-md border-2 transition-all
                    ${
                      isMarked
                        ? "bg-primary text-primary-foreground border-primary scale-105"
                        : "bg-background hover:bg-accent border-border hover:border-primary/50"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${square.type === "center" ? "bg-primary/10 border-primary/30" : ""}
                  `}
                >
                  {isMarked ? (
                    <CheckCircle2 className="w-6 h-6 mx-auto text-primary" />
                  ) : (
                    <span className="line-clamp-3 text-center text-xs leading-tight">{square.text}</span>
                  )}
                </button>
              )
            })
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Mark 5 squares in a row, column, or diagonal to complete!
        </p>
      </CardContent>
    </Card>
  )
}

interface BingoCardsListProps {
  bingoCards: BingoCardProps["bingoCard"][]
}

export function BingoCardsList({ bingoCards }: BingoCardsListProps) {
  if (bingoCards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No active bingo cards at the moment!</p>
          <p className="text-sm mt-2">New seasonal bingo cards will appear each season.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {bingoCards.map((card) => (
        <BingoCard key={card.id} bingoCard={card} />
      ))}
    </div>
  )
}

