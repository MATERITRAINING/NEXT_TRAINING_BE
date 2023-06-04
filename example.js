function cekBilangan(value) {
  if (value % 2 === 0) {
    return `${value} adalah bilangan genap`;
  } else {
    return `${value} adalah bilangan ganjil`;
  }
}


const smk = 'smk mq'


module.exports = {cekBilangan, smk}
