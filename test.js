var obj = {
  a: '1',
  b: [{
      id: 1,
      name: 'xsx',
      flag: 1
    },
    {
      id: 2,
      name: 'xsx',
      flag: 1
    },
    {
      id: 3,
      name: 'xxxxxx',
      flag: 0
    },
    {
      id: 4,
      name: 'xxxxxx',
      flag: 0
    },
    {
      id: 5,
      name: 'xsx',
      flag: 1
    }, 
    {
      id: 6,
      name: 'xxxxxx',
      flag: 0
    }, 
    {
      id: 7,
      name: 'xxxxxx',
      flag: 1
    },
  ]
}

obj.b = obj.b.filter(item => {
  return !item.flag
})

console.log(obj);
