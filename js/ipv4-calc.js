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
function ipv4_dot2int(ip_dot){
    /** Convert ip_dot from its dotted-decimal notation to an int number.
     * * ip_dot is a string, like '127.0.0.1'.
     * Returns an int number.
     */

    var ip_arr = [],
        aux = ip_dot.split('.'),
        ip_int = 0;

    for (var i = 0; i < 4; i++){
        ip_arr.push(parseInt(aux[i]));
    }

    for (var i = 0; i < 4; i++){
        ip_int = ip_int << 8;
        ip_int += ip_arr[i];
    }

    return ip_int;
}

function ipv4_int2dot(ip_int){
    /* Convert ip_int from an int number to its dotted-decimal notation.
     * * ip_int is an integer number.
     * Returns a string.
     */
    
    var ip_arr = [],
        ip_dot = '';

    for (var i = 0; i < 4; i++){
        ip_arr.push(ip_int & 255);
        ip_int = ip_int >> 8;
    }

    ip_arr.reverse();

    for (var i = 0; i < 4; i++){
        ip_dot += ip_arr[i] + '.';
    }

    return ip_dot.slice(0, -1);
}

function fill_mask(n){
    /* Given n bits of a mask, generates that mask. */

    var ip_mask = 0;

    for (var i = 0; i < n; i++){
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

function ipv4_is_private(ip_addr){
    /* Returns true or false for a private ip_addr --must be as an int. */

    if (((ip_addr >= 167772160) && (ip_addr <= 184549375)) ||
        ((ip_addr >= -1408237568) && (ip_addr <= -1408172033)) ||
        ((ip_addr >= -1062731776) && (ip_addr <= -1062666241))){
        return true;
    }
    else { return false; }
}

function get_wildcard(ip_mask){
    return ~ip_mask;
}

function get_network(ip_addr, ip_mask){
    return ip_addr & ip_mask;
}

function get_broadcast(ip_addr, ip_mask){
    return get_network(ip_addr, ip_mask) | get_wildcard(ip_mask);
}

function get_first_host(ip_addr, ip_mask){
    return get_network(ip_addr, ip_mask) + 1;
}

function get_last_host(ip_addr, ip_mask){
    return get_broadcast(ip_addr, ip_mask) - 1;
}

function get_number_hosts(ip_mask){
    return (-1 ^ ip_mask) - 1;
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
        ip_mask = -16777216,  // 255.0.0.0
        stat = 0;  // 0: parsing OK; 1: error occurred

    if (new RegExp(re_ip_addr).exec(entry[0])){
        ip_addr = ipv4_dot2int(entry[0]);
    }
    else { stat = 1; }

    if (entry.length > 1){
        if (new RegExp(re_bits_subnet).exec(entry[1])){
            ip_mask = fill_mask(entry[1]);
        }
        else if (new RegExp(re_ip_addr).exec(entry[1])){
            ip_mask = ipv4_dot2int(entry[1]);
        }
        else {
            stat = 1;
            ip_mask = auto_mask(ip_addr);
        }
    }
    else {
        ip_mask = auto_mask(ip_addr);
    }

    return [ip_addr, ip_mask,
            get_wildcard(ip_mask),
            get_network(ip_addr, ip_mask),
            get_broadcast(ip_addr, ip_mask),
            get_first_host(ip_addr, ip_mask),
            get_last_host(ip_addr, ip_mask),
            get_number_hosts(ip_mask),
            ipv4_is_private(ip_addr),
            stat];
}

function dec2bin(n){
    /* Convert an n decimal integer to binary.  Returns a string. */

    var aux = 0
        ret = '';

    for (var i = 0; i < 4; i++){
        aux = (n & 255).toString(2);
        
        while (aux.length < 8){ aux = '0' + aux; }

        ret = aux + ' ' + ret;
        n = n >> 8;
    }

    return ret.slice(0, -1);
}


/**
 * CALLBACK FUNCTIONS
 */
function update_interface(p){
    if (p[9]){
        $('#input-ipmask').parent().addClass('has-error');
    }
    else{
        $('#input-ipmask').parent().removeClass('has-error');
    }

    for (var i = 0; i < 7; i++){
        $('#octet-' + i).text(ipv4_int2dot(p[i]));
    }
    $('#octet-7').text(p[7]);

    for (var i = 0; i < 7; i++){
        $('#octet-' + i + '-bin').text(dec2bin(p[i]));
    }
    $('#octet-7-bin').text(p[7].toString(2));

    if (p[8]){
        for (var i = 0; i < 8; i++){
            $('#span-' + i).addClass('label-danger');
        }
    }
    else{
        for (var i = 0; i < 8; i++){
            $('#span-' + i).removeClass('label-danger');
        }
    }
}

function on_input_enter(e){
    var p = [];

    if (e.keyCode == 13){
        p = parser($('#input-ipmask').val());
        update_interface(p);
    }
}

function on_uri_parameter(param){
    var p = parser(param);
    $('#input-ipmask').val(param);
    update_interface(p);
}

$(document).ready(function(){
    $('#input-ipmask').keypress(on_input_enter);
    
    if (window.location.search) {
        on_uri_parameter(window.location.search.replace(/^\?addr=/, ''));
    }
});
