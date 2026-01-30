import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // p5.js globals (with type info from @types/p5)
        createCanvas: 'readonly',
        resizeCanvas: 'readonly',
        frameRate: 'readonly',
        windowWidth: 'readonly',
        windowHeight: 'readonly',
        save: 'readonly',
        saveJSON: 'readonly',
        // Browser globals
        document: 'readonly',
        window: 'readonly',
        // Your class globals
        Maze: 'readonly',
        MazeBuilderByDivideAndConquer: 'readonly',
        MazeBuilderByDFS: 'readonly',
        AStarMazeSolver: 'readonly',
        Wall: 'readonly',
        Cell: 'readonly',
        Grid: 'readonly',
      },
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 4],
      'no-unused-vars': 'off',
      'no-console': 'off',
    },
  },
];