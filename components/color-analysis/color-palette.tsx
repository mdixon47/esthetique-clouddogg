interface ColorPaletteProps {
    colors: string[]
  }
  
  export function ColorPalette({ colors }: ColorPaletteProps) {
    return (
      <div className="flex space-x-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
            aria-label={`Color swatch ${index + 1}`}
            role="img"
          />
        ))}
      </div>
    )
  }
  