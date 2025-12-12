# Pokémon Battle System

## Project Description

A JavaScript-based Pokémon battle simulator featuring turn-based combat mechanics, type effectiveness, move selection, and a complete stat/leveling system. Built using HTML5 Canvas with a state machine architecture to manage game flow. I worked on implementing the Battle system. All other features are credited to my teacher, Vikram Singh.

## Purpose & Context

This project was developed as an academic assignment for a Computer Science course focusing on game development fundamentals. The assignment challenged students to implement core Pokémon battle mechanics from scratch, including damage calculation formulas, state management patterns, and smooth UI animations.

The project emphasizes:
- Object-oriented programming principles
- State machine design patterns
- Event-driven architecture
- UI/UX implementation with tweening animations

## Key Features

### Battle Mechanics
- **Turn-Based Combat**: Player and opponent alternate attacks with move selection
- **Type Effectiveness**: Full type chart implementation (Fire, Water, Grass, Electric, etc.) with damage multipliers
- **Move System**: Each Pokémon has a unique moveset with different types and power levels
- **Damage Calculation**: Complex formula factoring in attacker level, move power, and attack/defense stats

### Progression System
- **Experience & Leveling**: Pokémon gain experience from battles and level up
- **Stat Calculations**: Dynamic stat growth based on level progression
- **Stat Change Display**: Visual panels showing before/after stats when leveling up

### Visual Polish
- **Animated Health Bars**: Smooth tweening animations when damage is dealt
- **Experience Bar**: Animated progress bar filling up after gaining exp
- **Battle Transitions**: Fade effects and platform slide-ins for battle start
- **Sound Effects**: Type-specific hit sounds and battle music

### Battle Options
- **Fight**: Select from available moves
- **Status**: Check your Pokémon's current stats
- **Run**: Escape from battle back to the overworld

## Technical Highlights

### State Management
The project uses a state stack architecture with specialized states:
- `BattleState` - Main battle coordinator
- `BattleMenuState` - Action selection menu
- `BattleTurnState` - Processes attack turns
- `BattleMessageState` - Displays battle messages
- `PlayState` - Overworld exploration

### Animation System
Implemented using a Timer-based tweening library with easing functions for smooth health bar depletion and experience gain visualization.

### Type Effectiveness Service
A dedicated service class maintains the complete type matchup chart, returning appropriate multipliers and effectiveness messages ("It's super effective!", "It's not very effective...").

## Development Challenges

- **State Chain Communication**: Passing selected moves through multiple states (move menu → battle menu → turn state)
- **Animation Timing**: Ensuring experience bar animations complete before triggering level-up sequences
- **Health Bar Synchronization**: Coordinating damage calculations with visual health bar tweening
- **Sound Format Handling**: Resolving PascalCase vs kebab-case naming mismatches for audio files

## Technologies Used

- JavaScript (ES6+)
- HTML5 Canvas
- State Machine Pattern
- Tweening/Animation Library
- Sprite-based Graphics

## Authors
Ahmed Hassan - Computer Science Student  
Vikram Singh - Computer Science Teacher

---
