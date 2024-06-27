# Fast math

[![Netlify Status](https://api.netlify.com/api/v1/badges/8ed658cc-b686-4fa4-aec1-4fb339012496/deploy-status)](https://app.netlify.com/sites/fast-math-mallo-c/deploys)

A math game about fast counting.
## Note
The project is abandoned, but that does not mean it's unsafe. If I find any vulnerabilities, I'll patch them as fast as I can. If you find any vulnerabilities, please let me know. See my profile for contact information.

It's safe to use it for now.

## Build and run
```
npm install
npm run build
cd dist
npx serve
```
## Custom settings
Modify settings in file `src/settings.ts`.
Quick overview:

| Property name             | Meaning                                                                                              |
|---------------------------|------------------------------------------------------------------------------------------------------|
| `numberOfStars`           | The best rating you can get                                                                          |
| `answerTime`              | The time the program gives for an answer in seconds                                                  |
| `answerVariants`          | How much variants program will give                                                                  |
| `taskGenerator`           | How the tasks would be generated                                                                     |
| `taskGenerator.maxNumber` | 1. The largest number the program may give as a parameter;<br/>2. `linear` if the limit should grow. |
| `taskGenerator.ratio`     | Only if `taskGenerator.maxNumber` is `linear`. The ratio between given tasks and maximum number.     |
| `taskGenerator.minNumber` | Only if `taskGenerator.maxNumber` is `linear`. The smallest number program may give as a parameter.  |
| `resetTimeIfWrong`        | `true` if program should reset remaining time if user's answer is wrong, `false` otherwise.          |
| `doReset`                 | `true` if program should reset time ever. If it is `false`, `resetTimeIfWrong` will be ignored.      |
| `penalty`                 | Penalty time for the wrong answer in ms                                                              |

## Demo
Demo with default settings: https://fast-math-mallo-c.netlify.app/
