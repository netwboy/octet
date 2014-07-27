/**
 * ipv4-calc.js
 *
 * Implements JavaScript functions to deal with IPv4 addresses.  It also
 * have routines to manage the user interface.
 *
 * Author: José Lopes de Oliveira Jr. <http://jilo.cc>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/


/**
 * CORE FUNCTIONS
 */
function ipv4_str2int(ip_str){
    /* Convert an IPv4 address from its string notation to an int number. */

    var ip_arr = [],
        aux = ip_str.split('.'),
        ip_int = 0;

    for (var i=0; i < 4; i++){
        ip_arr.push(parseInt(aux[i]));
    }

    for (var i=0; i < 4; i++){
        ip_int = ip_int << 8;
        ip_int += ip_arr[i];
    }

    return ip_int;
}

function ipv4_int2str(ip_int){
    /* Convert an IPv4 address from an int array to its string notation. */
    
    var ip_arr = [],
        ip_str = '';

    for (var i=0; i < 4; i++){
        ip_arr.push(ip_int & 255);
        ip_int = ip_int >> 8;
    }

    ip_arr.reverse();

    for (var i=0; i < 4; i++){
        ip_str += ip_arr[i] + '.';
    }

    return ip_str.slice(0, -1);
}

function fill_mask(n){
    /* Given n bits of a mask, generates that mask. */

    var ip_mask = 0;

    for (var i=0; i < n; i++){
        ip_mask++;
        if (i != n - 1) { ip_mask = ip_mask << 1; }
    }

    ip_mask = ip_mask << (32 - n);

    return ip_mask;
}

function auto_mask(ip_addr){
    /* Set mask according to classful network rules.
     * ip_addr must be a valid IP address in int format.
     */

    if (0 <= ip_addr && ip_addr <= 2147483647){
        return fill_mask(8);
    }
    else if (-2147483648 <= ip_addr && ip_addr <= -1073741825){
        return fill_mask(16);
    }
    else if (-1073741824 <= ip_addr && ip_addr <= -536870913){
        return fill_mask(24);
    }
    else {
        return fill_mask(28);
    }
}

function get_subnet(ip_addr, ip_mask){
    return ip_addr & ip_mask;
}

function get_broadcast(ip_addr, ip_mask){
    return get_subnet(ip_addr, ip_mask) | ~ip_mask;
}

function get_wildcard(ip_mask){
    return ~ip_mask;
}

function get_number_hosts(ip_mask){
    return (-1 ^ ip_mask) - 1;
}

function get_first_host(ip_addr, ip_mask){
    return get_subnet(ip_addr, ip_mask) + 1
}

function get_last_host(ip_addr, ip_mask){
    return get_broadcast(ip_mask, ip_mask) - 1
}


/**
 * INTERFACE FUNCTIONS
 */
function parser(text){
    /* text could be 127.0.0.1 or 127.0.0.1/8 or 127.0.0.1/255.0.0.0 */

    var re_ip_addr = '^(((1[0-9]|[1-9]?)[0-9]|2([0-4][0-9]|5[0-5]))\.){3}((1[0-9]|[1-9]?)[0-9]|2([0-4][0-9]|5[0-5]))$',
        re_bits_subnet = '(^3[012]$|^[12][0-9]$|^[0-9]$)';
        entry = text.split('/'),
        ip_addr = 2130706433,  // 127.0.0.1
        ip_mask = -16777216;  // 255.0.0.0

    if (new RegExp(re_ip_addr).exec(entry[0])){
        ip_addr = ipv4_str2int(entry[0]); console.log('entrou');
    }

    if (entry.length > 1){
        if (new RegExp(re_bits_subnet).exec(entry[1])){
            ip_mask = fill_mask(entry[1]);
        }
        else if (new RegExp(re_ip_addr).exec(entry[1])){
            ip_mask = ipv4_str2int(entry[1]);
        }
    }
    else {
        ip_mask = auto_mask(ip_addr);
    }

    return [ip_addr, ip_mask];
}


/**
 * CALLBACK FUNCTIONS
 */
for (var i=0; i <= 32; i++){
    console.log(i + '\t-\t'+ ipv4_int2str(fill_mask(i)));
}
