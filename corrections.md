# Corrections and Known Issues

## Overview
This document tracks corrections, known issues, and their solutions for the project. Use this as a reference when encountering common problems or for implementing planned improvements.

## Current Issues and Solutions

### Critical
### High Priority
### Medium Priority
1. Data and components in same file
    - Issue: The data array and the component code exists in same file
    - Solution: Move this array to the data directory so that the data can be updated in the future without touching the component code
    - Implementation for features array:
        1. Inside `data` directory create `landing-features.ts` file
        2. Copy the `features` array into the file and export the array

2. Button text not visible
    - Issue: `Learn more` button text not visible in `landing-cta.tsx` file
    - Solution: Correct text color
    - Implementation:
        ```tsx
        <Button variant="outline" className="text-pink-500 border-white hover:bg-pink-400">
            Learn more
        </Button>
        ```              

3. Clothing item color text not visible
    - Issue: Text of the color of clothing item not visible in `clothing-card.tsx` file
    - Solution: Correct text color
    - Implementation:
        ```tsx
        <Badge key={color} variant="outline" className="bg-white text-black">
            {color}
        </Badge>
        ```

4. MoreHorizontal Icon not visible
    - Issue: The background of `MoreHorizontal` icon not visible properly in light and dark theme in `clothing-card.tsx` file
    - Solution: Correct background color
    - Implementation:
        ```tsx
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 group"
        >
            <MoreHorizontal className="h-4 w-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
        </Button>
        ```               

5. Text not visible in dark theme
    - Issue: The user style types not visible in dark theme in `profile-header.tsx` file
    - Solution: Correct text color for dark theme
    - Implementation:
        ```tsx
        <Badge key={style} variant="outline" className="flex items-center gap-1 bg-pink-100 text-pink-800 hover:bg-pink-200">
            {style}
        </Badge>
        ```          

### Low Priority
1. Lucide icon deprecated
    - Issue: Lucide twitter icon is deprecated
    - Solution: Use `X` instead
    - Implementation:
        ```tsx
        import { X } from "lucide-react"

        <Button variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              X.com
        </Button>
        ```

2. Incorrect background color for the text
    - Issue: The text `Or continue with` has light background in dark theme and vice versa 
    - Solution: Have black backgroud for the text for dark theme and white background in light theme
    - Implementation:
        ```tsx
        <span className="dark:bg-black px-2 text-white-500">Or continue with</span>
        ```

3. Hover effect for clothing card
    - Issue: The clothing card has no hover effect for dark theme 
    - Solution: Add css classes for hover effect for dark theme
    - Implementation:
        ```tsx
        <Card
          className={`overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-white/10 hover:border-gray-200 dark:hover:border-gray-700 ${
            viewMode === "list" ? "flex flex-col sm:flex-row" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        ```

4. Filters divison background color issue for dark theme
    - Issue: The background color for filters section in `outfit-generator.tsx` is not suitable for dark theme
    - Solution: Correct the background color for dark theme
    - Implementation:
        ```tsx
        <div className="dark:bg-gray-900 bg-gray-50 rounded-lg p-4 flex flex-wrap gap-3">
        ```

## Implementation Notes
- Replace the faulty code with the code given in implementation for each issue 
- Apply the solution given in this file for similar issues wherever applicable 
        
---
Last updated: June 3, 2025