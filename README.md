# Chess STM - Speech-To-Move Extension

A Chrome extension that lets you play chess on chess.com hands-free by converting your speech into moves using Standard Chess Notation.

## Overview

Chess STM allows you to control your moves on chess.com by speaking instead of clicking. Simply speak your move in Standard Chess Notation (e.g., "e4", "knight f3", "bishop takes d5") and the extension will automatically play it for you.

**Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/chess-stm-20/ljfmadjpfifkknpkhpoplblhmfhjakge)**

## Features

- **Voice-controlled moves** - Play moves by speaking Standard Chess Notation
- **Improved speech correction** (v2.0) - Better at accurately converting speech to valid chess moves
- **Standard Notation Support** - Use algebraic notation including pieces: "knight f3", "bishop takes b4", "rook ae1", etc.
- **Flexible syntax** - Words like "to", "take/takes", "check", "checkmate" and "pawn" are optional
- **Piece notation** - Supports king, queen, rook, bishop, knight and pawn notation

## Installation

1. Open the [Chess STM Chrome Web Store page](https://chromewebstore.google.com/detail/chess-stm-20/ljfmadjpfifkknpkhpoplblhmfhjakge)
2. Click **Add to Chrome**
3. Confirm the permissions
4. Navigate to any game on chess.com and start saying your moves!

## Development Setup

How to build or modify the extension locally:

### Prerequisites
- Node.js and npm installed

### Build Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/kavi656/chess-stm.git
   cd chess-stm
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Build the extension:**
   ```
   npm run build
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the project directory
   - The extension should then appear in your chrome toolbar

5. **For development (watch mode):**
   ```
   npm run dev
   ```
   This will automatically rebuild when you make changes to `src/index.js`

## Usage

### Basic Notation Examples

| What You Say | Move Played |
|---|---|
| "e4" | Pawn to e4 |
| "knight f3" | Knight to f3 |
| "bishop takes d5" | Bishop captures on d5 |
| "bishop xd5" | Bishop captures on d5 |
| "bishop d5" | Bishop to d5 |
| "rook ae1" | Rook on a-file to e1 |

## Technical Details

- Built with the [chess.js](https://github.com/jhlywa/chess.js) library
- Uses the Web Speech API for speech recognition
- Runs as a content script on chess.com
- Webpack bundled

## Important Limitations

- Works exclusively on chess.com
- Does not work if the board has been manually flipped
- Requires a stable internet connection
- Low background noise recommended
- Pawn promotion not yet supported unless auto-queen enabled

## License

MIT License - Feel free to use, modify and distribute this extension.
 