let letters = 'svg';
let object = [
	{
		q: 5,
		t: 4,
		r: 6,
	},
	{
		q: 1,
		t: 2,
		r: 3,
	},
];

const replaceObj = (letter, obj) => {
	let output = letter.replace(/s/g, obj.q);
	output = output.replace(/v/g, obj.t);
	output = output.replace(/g/g, obj.r);

	return output;
};

const result = object.map((el) => replaceObj(letters, el)).join('');

console.log(result);
