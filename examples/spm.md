## code

```css
```

```html
<div id=app></div>
```

```js
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { PullScroll } from 'index';

render(
  <PullScroll 
    text="你好"
  />,
  document.getElementById('app')
)

```