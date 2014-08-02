Octet
=====

Another IP calculator.  Octet is an open-source IP calculator written in JavaScript.  The main goal of this project is to be an IP calculator accessible by browser and mobile devices --responsive design.


## Input

You can use one of these input formats:

1. `127.0.0.1`;
2. `127.0.0.1/8`;
3. `127.0.0.1/255.0.0.0`.

If you insert an unacceptable format or leave it in blank, the input element will go red and the default values will be considered --`127.0.0.1/8`.


## Application Programming Interface (API)

Using the functions in `js/ipv4-calc.js` file, you're able to do things like:

```javascript
for (var i=0; i <= 32; i++){
    console.log(i + '\t-\t'+ ipv4_int2str(fill_mask(i)));
}
```

or

```javascript
for (var i=0; i < 1024; i++){
    console.log(i + '\t-\t' + dec2bin(i));
}
```
