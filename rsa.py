import random

def get_prime_num(up_limit):
    simple_arr = []
    cur_num = up_limit
    i = 2
    while i <= cur_num:
        if i not in simple_arr:
            simple_arr.append(i)
        if cur_num % i == 0:
            cur_num -= 1
            i = 2
            continue
        else:
            i += 1
            while True:
                num = 0
                for k in range(len(simple_arr)):
                    if i % simple_arr[k] == 0:
                        i += 1
                        break
                    num = k + 1
                if num >= len(simple_arr):
                    break
    return simple_arr

UPPER_LIMIT = 1000
arr = get_prime_num(UPPER_LIMIT)
random_indexes = random.sample(range(len(arr)), 2)
p = arr[random_indexes[0]]
q = arr[random_indexes[1]]
print('Chosen prime numbers: ', p, ', ', q)

module = p * q
euler = (p - 1) * (q - 1)
print("Module: ", module)
print("Euler function: ", euler)

def computeGCD(x, y):
    while(y):
       x, y = y, x % y
    return abs(x)

# choosing open exponent parameter randomly
arr1 = get_prime_num(euler)
open_exp = random.choice(arr1)
while computeGCD(euler, open_exp) != 1:
    open_exp = random.choice(arr1)

# generate public/open key
open_key = [open_exp, module]

# generate private/closed key
num = 1
while True:
    if (num * euler + 1) % open_exp == 0:
        private = (num * euler + 1) // open_exp
        if private != open_exp and (private * open_exp) % euler == 1:
            break
        else:
            num += 1
    else:
        num += 1

# print generated keys
print('Public key:', '{' + str(open_exp) + ' - ' + str(module) + '}')
print('Private key:', '{' + str(private) + ' - ' + str(module) + '}')

# testing
my_num = int(input('Test. Enter number: '))
encrypted = pow(my_num, open_exp, module)
print('Encrypted:', encrypted)
decrypted = pow(encrypted, private, module)
print('Decrypted:', decrypted)
