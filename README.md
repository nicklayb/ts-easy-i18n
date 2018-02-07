# ts-easy-i18n

## Installation

```ts
npm install --save ts-easy-i18n
```


### Usage

#### Creating new language bundle

You can create a language bundle by using the `registerLang` function from the package. You first pass in the language abbreviation, then you pass the translation object :
```ts
import { registerLang } from 'ts-easy-i18n';

registerLang('en', {
    home: 'Home',
    user: 'User'
});
```

##### Nesting language bundles

You can nest language bundle into sub object for easier listing.
```ts
import { registerLang } from 'ts-easy-i18n';

registerLang('en', {
    home: 'Home',
    user: {
        firstname: 'Firstname',
        config: {
            language: 'Language'
        }
    }
});
```

And then pass in a slug splitted by dot to the `trans()` or `process()` function like :

```ts
import { process } from 'ts-easy-i18n';
process('user.config.language') //  Would output "Language"
```

#### Switching locales

You can switch locale with the `setCurrentLocale` function. **Make sure you already registered the language or it'll fallback to english**

```ts
import { registerLang, setCurrentLocale } from 'ts-easy-i18n';

registerLang('en', {
    home: 'Home',
    user: 'User'
});

setCurrentLocale('en');
```

### Advanced usage

#### Parameters

You may require to parameterize string instead of concatenate them. You can do so by providing your parameter key with a colon (`:`) inside you string. For instance, I want to say Hi to my users.

```ts
import { registerLang, process } from 'ts-easy-i18n';

registerLang('en', {
    welcome: 'Hi :fullname'
});

process('welcome', {
    fullname: 'John Doe'
});
```

The rendered text will be `Hi John Doe`.

#### Formatters

You may want to format text sometimes. It helps you keep your translation base clean and reusable because you will be formatting it on runtime.

First, you must register your formatter with the `registerFormatters` helper. It simply takes and object in parameter with the function you use as formatters

```ts
import { registerFormatters } from 'ts-easy-i18n';

registerFormatters({
    uppercase: text => text.toUpperCase(),                          //  Uppercases the text
    surround: (text, params) => `${params[0]}${text}${params[1]}`,  //  Surround text with whatever
});
```

And then you pass a string with all the formatters you want splitted by pipes

```ts
import { format, process } from 'ts-easy-i18n';

registerLang('en', {
    welcome: 'Hi :fullname'
});

registerFormatters({
    uppercase: text => text.toUpperCase(),
    exclamation: text => text + '!',
});

process('welcome', { fullname: 'John Doe' }, ['uppercase', 'exclamation']);
```

It would render `HI JOHN DOE!`.

##### Format with parameters

It may end up with the need to parameterize these formatters. Stay safe, we did it for you. You can, after you formatter key, add a colon (`:`) and pass in parameters splitted by commas

I want a formatter to surround a text with things. Sometimes it'll be parentheses, sometimes brackets.

```ts
import { registerFormatters, registerLang, format } from 'ts-easy-i18n';

registerLang('en', {
    home: 'Home'
});

registerFormatters({
    surround: (text, params) => params[0] + text + params[1]
});

format('home', ['surround:(,)']);    //  Will output "(Home)"
format('home', ['surround:[,]']);    //  Will output "[Home]"
```

### Four way to do things
#### `transChoice` **New**
##### Declaring cases

There are two type of pluralisation rule you can use. An `ExactRule` which is exactly a numer or anything. Also a `RangeRule` which checks if a value is between two other value or the Infinity. All you need to do is set an array instead of a string.

**Exact rule**

Use the creator `createExactRule` from the package to proceed.

Parameters are :
- `text`: The text
- `count` (*optional*): The value to compare (*if you do not provide any value, it's considered as a an "else" case where anything will work*)

```ts

import { createExactRule } from 'ts-easy-i18n';

registerLang('en', {
    friends: [
        createExactRule('No friends... sorry...', 0),   //  If 0 is provided
        createExactRule('Oh! :count friends, nice'),    //  else (the :count will print the actual given count)
    ]
});
```

**Range rule**

Use the creator `createRangeRule` from the package to proceed.

Parameters are :
- `text`: The text
- `min`: The minimum value to compare
- `max` (*optional*): The maximum value to compare (*if you do not provide any value, Infinity will be set*)

```ts

import { createRangeRule } from 'ts-easy-i18n';

registerLang('en', {
    friends: [
        createRangeRule('You have a friend, that\'s a strat', 1, 1),    //  You could replace this with an Exact rule
        createRangeRule('Oh! :count friends, it\'s a beggining', 2, 5), //  Between 2 and 5
        createRangeRule('Oh! :count friends, it\'s a beggining', 6),    //  From 6 and so on
    ]
});
```

Here is how you call it.

```ts
import { transChoice } from 'ts-easy-i18n';

registerLang('fr', {
    friends: [
        createExactRule('No friends... sorry...', 0),   //  If 0 is provided
        createExactRule('Oh! :count friends, nice'),    //  else (the :count will print the actual given count)
    ],
    hasFriend: [
        createExactRule(':fullname has no friend', 0),                  // 0 case
        createRangeRule(':fullname starts with :count friends', 1, 10), // Between 1 and 10
        createRangeRule(':fullname has :count friends', 11),            // From 11 and so on
    ]
});

transChoice('friends', 0);  // "No friends... sorry..."
transChoice('friends', 5);  // "Oh! 5 friends, nice"
transChoice('hasFriends', 0, { fullname: 'Super Mario' });  // "Super Mario has no friend"
transChoice('hasFriends', 5, { fullname: 'Super Mario' });  // "Super Mario starts with 5 friends"
transChoice('hasFriends', 100, { fullname: 'Super Mario' });  // "Super Mario has 100 friends"
```

#### `trans`
The trans function only translate the text with parameters. You cannot provide formatters to it.

```ts
import { trans } from 'ts-easy-i18n';

trans('hi');
//  or
trans('hi' , {
    fullname: 'Paul'
});
```
#### `format`

The format function only formats the text with given formatters. You cannot translate de text with it.

```ts
import { format } from 'ts-easy-i18n';

format('hi' , ['uppercase']);
```

#### `process` or `processChoice`
The process function does everything from the functions `trans` and `format`. This what to you if you want to format a translated text

```ts
import { process } from 'ts-easy-i18n';

process('hi');
//  or
process('hi', { fullname: 'Robert'});
//  or
process('hi', { fullname: 'Robert'}, ['uppercase']);

processChoice('hi', 6, { fullname: 'Robert'}, ['uppercase']);
```

