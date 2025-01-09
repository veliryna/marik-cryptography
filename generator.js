class LFSR {
  constructor(seed, coefficients) {
    this.coefficients = coefficients;
    this.register = seed;
  }
  
  shift() {
    const feedbackBit = this.coefficients.reduce((accumulator, coefficient) => {
      return accumulator ^ ((this.register >> (coefficient - 1)) & 1);
    }, 0);
    
    this.register >>= 1;
    this.register |= (feedbackBit << (this.coefficients[0] - 1));
    
    return this.register & 1;
  }
}

class Generator {
  constructor(inputSeeds, outputSeeds) {
    this.inputLFSRs = inputSeeds.map(seed => new LFSR(seed, [16, 12, 3, 1]));
    this.outputLFSRs = outputSeeds.map(seed => new LFSR(seed, [16, 12, 3, 1]));
  }
  
  generate() {
    let sequence = "";
    for (let i = 0; i < 10000; i++) {
      const inputBits = this.inputLFSRs.map(lfsr => lfsr.shift());
      const outputIndex = parseInt(inputBits.join(""), 2) % 64;
      const outputBit = this.outputLFSRs[outputIndex].shift();
      sequence += outputBit;
    }
    return sequence;
  }
}

function generateSeedList(length) {
  const seedList = [];
  while (seedList.length < length) {
    // Generate a random 16-bit seed and ensure its unique
    const seed = Math.floor(Math.random() * Math.pow(2, 16)); 
    if (!seedList.includes(seed)) {
      seedList.push(seed);
    }
  }
  return seedList;
}
// Create an instance of generator
const generator = new Generator(
  [0xACE1, 0x1357, 0x2468, 0x9BDF, 0xC24A, 0xF753, 0x8D6C, 0xEB91],
  generateSeedList(256)
);

// Generating the sequence
const sequence = generator.generate();
let splitSequence = sequence.split("")
let arrSequence = splitSequence.map((value) => parseInt(value, 2))
console.log(arrSequence);
console.log("Sequence Length: ", arrSequence.length)

// Frequency test
function F_test(result){
    let total = result.reduce((sum, elem) => sum + elem, 0)
    console.log('Frequency Test: ', total/result.length);
}
// Differential frequency test
function DF_test(result){
  let total = result.reduce(
    (sum, elem, index, arr) => {
        if(index !== 0){
            return sum + XOR(elem, arr[index-1]);
        } else{
            return sum;
        }                
    }, 0)
  console.log('Differential Frequency Test: ', total/(result.length-1));
}
// XOR help function
function XOR(bit1, bit2){
  return (bit1 === bit2) ? 0 : 1
}
F_test(arrSequence);
DF_test(arrSequence);

function W_test(range, seq){
    let table = []
    for(let i = 0; i < Math.pow(2, range); i++){
      let binary = i.toString(2)
      if(binary.length < range){
        binary = new Array(range - binary.length+1).join("0") + binary
      }
      table.push(new Object({
        combination: binary,
        count: 0
      }))
    }
    for(let i = 0; i < seq.length; i++){
      let window = ""
      for(let j = i; j < i + range; j++){
        window += seq[j]
      }
      for(let k = 0; k < table.length; k++){
        if(table[k]["combination"] === window){
          table[k]["count"]++
        }
      }
    }
    console.log("Window Test: ", table)
}
W_test(4, arrSequence)

// Berlecamp-Massey algo implementation
function BerlekampMasseyAlgorithm(sequence) {
  const n = sequence.length;
  let b = new Array(n).fill(0);
  let c = new Array(n).fill(0);
  b[0] = c[0] = 1;
  let l = 0;
  let m = -1;
  let d = 0;
  let N = 0;
  for (let N = 0; N < n; N++) {
    let d = 0;
    for (let i = 0; i <= l; i++) {
      d ^= c[i] & sequence[N - i];
    }
    if (d === 1) {
      const t = c.slice();
      const coef = new Array(n).fill(0);
      for (let i = 0; i <= N - m; i++) {
        coef[i + m - N] = b[i];
      }
      for (let i = 0; i < n; i++) {
        c[i] ^= coef[i];
      }
      if (l <= N / 2) {
        l = N + 1 - l;
        m = N;
        b = t.slice();
      }
    }
  }
  return l;
}
console.log("Linear Complexity: ", BerlekampMasseyAlgorithm(arrSequence))
