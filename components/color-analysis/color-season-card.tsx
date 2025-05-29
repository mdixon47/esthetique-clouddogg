import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorPalette } from "./color-palette"

interface ColorSeasonCardProps {
  season: string
  characteristics: string
  description: string
  colors: string[]
}

export function ColorSeasonCard({ season, characteristics, description, colors }: ColorSeasonCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{season}</CardTitle>
        <CardDescription>{characteristics}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Signature Colors:</h4>
          <ColorPalette colors={colors} />
        </div>
      </CardContent>
    </Card>
  )
}