<?php

# Fill array with the PRIME numbers up to $up_limit 
function get_simple_num($up_limit, &$simple_arr) {
	$result = null;
	$cur_num = $up_limit;
	$simple_arr = array();
	$i = 2;
	while ($i <= $cur_num) {
		if (!in_array($i, $simple_arr)) $simple_arr[] = $i;
		# if our current up limit divide by $i => decrease it by 1
		# example: $up_limit = 80; 80 % 2 == 0, so $up_limit = 79
		if ($cur_num%$i==0) {
			$cur_num--;
			$i = 2;
			continue;
		}
		else {
			# check new value for the $i, and its value must not be multiple previous $i values
			# example: if we check divisibility by 2, so we need not check divisibility by 4, 8, so on.
			$i++;
			while(true) {
				# in this variable we store how much items from $simple_arr we've already checked
				# if this count == $simple_arr.length => we FOUND new PRIME number and should break while(true)
				$num = 0;
				for($k=0; $k<count($simple_arr); $k++) {
					if ($i%$simple_arr[$k]==0) {
						$i++;
						# after changing $i value, we need check if new value again from the $simple_arr beginning
						# so break for loop, but $i has new value, and we begin checking again
						break;
					}
					$num = $k+1;
				}
				if ($num>=count($simple_arr)) break;
			}

		}
	}
	
}

# 1. Calculate upper limit for the key values: no more than 12 digits
# if you want to check increase the bits counts
# example $UPPER_LIMIT = 2 << 4; => so $UPPER_LIMIT = 2^5
$UPPER_LIMIT = 2 << 9; 

# 2. Fill array with the PRIME numbers no more than $UPPER_LIMIT
get_simple_num($UPPER_LIMIT, $arr);
print_r($arr);

# 3. Get two random PRIME numbers from the PRIME NUMBERS array
$random_indexes = array_rand($arr, 2);
$p = $arr[$random_indexes[0]];
$q = $arr[$random_indexes[1]];
echo 'Initial numbers '.$p.' and '.$q."\n";

# 4. Calculate module of $p and $q
$mult = $p*$q;

# 5. Calculate Eyler function
$eyler = ($p-1)*($q-1);

# 6. choose open exponenta
get_simple_num($eyler, $arr1);
do {
	$rand_index = rand(0, count($arr1)-1);
	$open_exp = $arr1[$rand_index];
	if ($eyler % $open_exp == 0) continue;
} while(false);

# 7. So my public key
$open_key = array($open_exp, $mult);

# 8. my private key
echo 'Source numbers: '.$p.' - '.$q."\n";
echo 'Eyler value: '.$eyler."\n";

$num = 1;
do {
	#echo 'Num: '.$num.': ';
	#echo '($num*$eyler + 1) % $open_exp: '.(($num*$eyler + 1) % $open_exp)."\n";
	
	if (($num*$eyler + 1) % $open_exp == 0) {
		$private = ($num*$eyler + 1)/$open_exp;
		#echo $private."\n";
		
		if ($private!= $open_exp && ($private * $open_exp) % $eyler == 1) {
			break;
		} else {
			$num++;
		}
	} else {
		$num++;
	}
		
} while(true);

echo 'Public key:  {'.$open_exp.' - '.$mult."}\n";
echo 'Private key: {'.$private.' - '.$mult."}\n";

$my_num = readline('Try to encrypt. Enter number: ');

$encrypted = gmp_pow($my_num, $open_exp) % $mult;
echo 'Encrypted: '.$encrypted."\n";

$decrypted = gmp_pow($encrypted, $private) % $mult;
echo 'Decrypted: '.$decrypted."\n";


