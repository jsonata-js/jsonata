---
id: sorting-grouping
title: Sorting, Grouping and Aggregation
sidebar_label: Sorting, Grouping and Aggregation
---

## Sorting

Arrays contain an ordered collection of values.  If you need to re-order the values, then the array must be sorted.  In JSONata, there are two ways of sorting an array:

1. Using the [`$sort()`](array-functions#sort) function.

2. Using the [order-by](path-operators#order-by-) operator.

The [order-by](path-operators#order-by-) operator is a convenient syntax that can be used directly in a path expression to sort the result sequences in ascending or descending order.  The [`$sort()`](array-functions#sort) function requires more syntax to be written, but is more flexible and supports custom comparator functions.

## Grouping

The JSONata [object constructor](construction#object-constructors) syntax allows you to specify an expression for the key in any key/value pair (the value can obviously be an expression too). The key expression must evaluate to a string since this is a restriction on JSON objects.  The key and value expressions are evaluated for each item in the input context (see [processing model](processing#the-jsonata-processing-model)). The result of each key/value expression pair is inserted into the resulting JSON object.

If the evaluation of any key expression results in a key that is already in the result object, then the result of its associated value expression will be grouped with the value(s) already associated with that key. Note that the value expressions are not evaluated until all of the grouping has been performed.  This allows for aggregation expressions to be evaluated over the collection of items for each group.

__Examples__

- Group all of the product sales by name, with the price of each item in each group
  <div class="jsonata-ex">
    <div>Account.Order.Product{`Product Name`: Price}</div>
    <div>{
  "Bowler Hat": [ 34.45, 34.45 ],
  "Trilby hat": 21.67,
  "Cloak": 107.99
}</div>
  </div>

- Group all of the product sales by name, with the price and the quantity of each item in each group
  <div class="jsonata-ex">
    <div>Account.Order.Product {
  `Product Name`: {"Price": Price, "Qty": Quantity}
}</div>
    <div>{
  "Bowler Hat": {
    "Price": [ 34.45, 34.45 ],
    "Qty": [ 2, 4 ]
  },
  "Trilby hat": { "Price": 21.67, "Qty": 1 },
  "Cloak": { "Price": 107.99, "Qty": 1 }
}</div>
  </div>

Note in the above example, the value expression grouped all of the prices together and all of the quantities together into separate arrays.  This is because the context value is the sequence of all grouped Products and the `Price` expression will select all prices from all products.  If you want to collect the price and quantity into individual objects, then you need to evaluate the object constructor _for each_ product in the context sequence.  The following example shows this.

- Explicit use of `$.{ ... }` to create an object for each item in the group.
  <div class="jsonata-ex">
    <div>Account.Order.Product {
  `Product Name`: $.{"Price": Price, "Qty": Quantity}
}</div>
    <div>{
  "Bowler Hat": [
    { "Price": 34.45, "Qty": 2 },
    { "Price": 34.45, "Qty": 4 }
  ],
  "Trilby hat": { "Price": 21.67, "Qty": 1 },
  "Cloak": { "Price": 107.99, "Qty": 1 }
}</div>
  </div>

- Multiply the Price by the Quantity for each product in each group
  <div class="jsonata-ex">
    <div>Account.Order.Product{`Product Name`: $.(Price*Quantity)}</div>
    <div>{
  "Bowler Hat": [ 68.9, 137.8 ],
  "Trilby hat": 21.67,
  "Cloak": 107.99
}</div>
  </div>

- The total aggregated value in each group
  <div class="jsonata-ex">
    <div>Account.Order.Product{`Product Name`: $sum($.(Price*Quantity))}</div>
    <div>{
  "Bowler Hat": 206.7,
  "Trilby hat": 21.67,
  "Cloak": 107.99
}</div>
  </div>



## Aggregation

Often queries are just required to return aggregated results from a set of matching values.  A number of aggregation functions are available which return a single aggregated value when applied to an array of values.

__Examples__

- Total price of each product in each order
  <div class="jsonata-ex">
    <div>$sum(Account.Order.Product.Price)</div>
    <div>198.56</div>
  </div>

- More likely want to add up the total of the price times quantity for each order
  <div class="jsonata-ex">
    <div>$sum(Account.Order.Product.(Price*Quantity))</div>
    <div>336.36</div>
  </div>

Other [numeric aggregation functions](aggregation-functions) are available (i.e. average, min, max) and an [aggregator for strings](string-functions#join).  It is also possible to write complex custom aggregators using the [`$reduce()`](higher-order-functions#reduce) higher-order function.

