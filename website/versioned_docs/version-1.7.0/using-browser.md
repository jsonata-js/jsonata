---
id: version-1.7.0-using-browser
title: Using JSONata in a Web page
sidebar_label: In a Web Page
original_id: using-browser
---

Example HTML page

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>JSONata test</title>
    <script src="https://cdn.jsdelivr.net/npm/jsonata/jsonata.min.js"></script>
    <script>
      function greeting() {
        var json = JSON.parse(document.getElementById('json').value);
        var result = jsonata('"Hello, " & name').evaluate(json);
        document.getElementById('greeting').innerHTML = result;
      }
    </script>
  </head>
  <body>
    <textarea id="json">{ "name": "Wilbur" }</textarea>
    <button onclick="greeting()">Click me</button>
    <p id="greeting"></p>
  </body>
</html>
```