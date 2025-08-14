# vocabme

a duolingo-inspired word learning app where users learn the words they choose, not a predefined curriculum.

## vision

vocabme is an endless learning path where users can learn every word in the english dictionary. unlike traditional apps that force you through their curriculum, vocabme lets you input any word you want to learn and provides multiple ways to master it.

## core concept

- **user-driven learning**: you choose what words to learn
- **endless progression**: no finish line, just continuous growth
- **evolutionary themes**: the app's visual theme changes as you progress through human evolution (deep ocean → shore → forest → savanna → town → city → moon → sci-fi)
- **mastery-based**: each word requires 20 interactions before being "learned"
- **multiple learning modes**: variety keeps engagement high

## features

### authentication
- sign in with x (twitter) oauth
- seamless session management
- user profiles with streaks and xp

### word management
- add any word you want to learn
- ai-powered definition suggestions (gpt-4o-mini)
- manual definition entry option
- no content filtering - learn any word regardless of content

### learning modes

#### 1. blank-in-sentence
- ai generates a sentence using your word
- you fill in the blank with the correct word
- multiple choice from your word pool

#### 2. match definition
- see a word, pick its correct definition
- choices include your other words' definitions as distractors

#### 3. free define (planned)
- write a definition in your own words
- ai grades it against the stored definition

#### 4. matching exercises (planned)
- **4a**: word ↔ definition pairs
- **4b**: word ↔ synonym pairs (ai generates synonyms)

#### 5. speak in context (planned)
- use the word in a sentence
- speech recognition + ai verification

### lesson engine
- **queue rule**: wrong answers go to the end, lesson only ends when all cards are answered correctly
- **smart batching**: 70% unlearned words, 15% learned review, 15% new words (if enabled)
- **random word generation**: when you need more words, ai generates random english words on demand
- **progression tracking**: each correct answer adds 1 "touch", 20 touches = learned

### gamification
- **streaks**: daily study tracking with streak bonuses
- **xp system**: 10 xp per correct answer, 50 bonus for 10-in-a-row
- **theme progression**: visual changes every 50-100 learned words
- **mascot system**: customizable character (planned)

### social features (planned)
- **friends**: add friends, send word recommendations
- **messaging**: direct messages between friends
- **leaderboards**: compare progress with friends

### tutor mode (v1)
- ai tutor with full context of your words
- mixes all learning modes
- same queue rule applies
- structured conversation with graded responses

## technical stack

### frontend
- **next.js 14** with app router
- **typescript** for type safety
- **tailwindcss** for styling
- **react** with server components

### backend
- **supabase** for auth, database, and realtime
- **postgres** with row-level security (rls)
- **openai gpt-4o-mini** for ai features

### key technologies
- **supabase auth** with x oauth
- **postgres triggers** for automatic touch counting
- **ai integration** for definitions, sentences, grading, and random word generation
- **middleware** for auth protection
- **server actions** for data mutations

## data model

### core tables
- **profiles**: user data, streaks, xp, settings
- **words**: user's word list with definitions and touch counts
- **attempts**: learning attempts with type, correctness, and metadata
- **sessions**: study sessions for xp aggregation
- **streak_log**: daily study tracking
- **themes**: visual theme bands by learned word count

### relationships
- all user data protected by rls (row-level security)
- attempts trigger automatically increments word touches
- sessions track xp and streak bonuses

## learning algorithm

### lesson building
1. **pool selection**: unlearned words (70%), learned review (15%), new words (15%)
2. **mode assignment**: alternating blank-in-sentence and match-definition
3. **queue management**: wrong answers recycled to end
4. **mastery tracking**: 20 touches = learned status

### ai integration
- **definitions**: 3-5 concise, learner-friendly options
- **sentences**: context-appropriate usage examples
- **grading**: beginner-level definition matching
- **random words**: on-demand english vocabulary generation

## development status

### completed
- ✅ project scaffold with next.js + typescript + tailwind
- ✅ supabase schema with tables, rls, triggers
- ✅ auth pages (sign-in, callback)
- ✅ basic ui layout (sidebar, bottom nav)
- ✅ add words page with ai suggestions
- ✅ lesson engine api (blank-in-sentence, match-definition)
- ✅ attempts logging and touch counting

### in progress
- 🔄 auth setup and testing
- 🔄 lesson ui refinement
- 🔄 random word generation

### planned
- 📋 tutor mode implementation
- 📋 remaining learning modes (free define, matching, speak)
- 📋 theme switching by learned count
- 📋 social features (friends, messaging)
- 📋 mascot and customization system

## getting started

### prerequisites
- node.js 18+
- supabase account
- openai api key
- x developer account (for oauth)

### setup
1. clone the repository
2. install dependencies: `npm install`
3. set up supabase:
   - run sql files in order (01-07)
   - configure x oauth provider
   - set auth urls
4. configure environment variables
5. start development: `npm run dev`

### environment variables
```env
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_ANON_PUBLIC_API_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
```

## architecture decisions

### why supabase?
- **auth**: built-in oauth with x support
- **database**: postgres with rls for security
- **realtime**: ready for social features
- **simplicity**: one platform for auth + db + realtime

### why no stored dictionary?
- **flexibility**: users can learn any word
- **freshness**: ai generates random words on demand
- **cost efficiency**: no need to maintain large word databases
- **personalization**: focus on user-chosen vocabulary

### why 20 touches?
- **mastery**: ensures deep learning, not just memorization
- **engagement**: provides clear progression goals
- **retention**: spaced repetition through review inclusion

## future vision

### phase 2 features
- **advanced ai tutor**: more sophisticated conversation
- **word difficulty**: adaptive learning based on user performance
- **export/import**: backup and share word lists
- **offline mode**: cached lessons for offline study

### phase 3 features
- **multiple languages**: expand beyond english
- **community features**: shared word lists, challenges
- **advanced analytics**: detailed learning insights
- **api access**: for third-party integrations

## contribution

this is a personal learning project focused on building a vocabulary app that puts user choice first. the goal is to create an engaging, endless learning experience that adapts to individual needs rather than forcing users through a rigid curriculum.

---

*built with next.js, supabase, and openai*
