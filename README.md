Octet
=====

Another IP calculator.  Octet is an open-source IP calculator written in JavaScript.  The main goal of this project is to be an IP calculator accessible by browser and mobile devices --responsive design.

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
