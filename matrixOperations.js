import {frac} from './frac.js';
import * as fraction from './frac.js'
import operations from './operations.js';
import vector from './vector.js';

/* ------------ Matrix Solution Operations ------------ */

/*
 * Reduces a matrix of any dimension to RREF. Implemented Recursively.
 * No return value - uses reference.
 */

function reducedRowEchelon(matrix, i, j) {

	// End iterations if at right end of matrix

	if ((j >= matrix[0].length) || (i >= matrix.length)) {
		console.log("Finished! Returning.")
		return;
	}

	// Checks if the pivot position down is all zero

	let hasNonZero = false;
	for (let x = i; x < matrix.length; x++) {
		if (fraction.isNonZero(matrix[x][j])) {
			hasNonZero = true;
		}
	}

	// If it doesn't have a nonzero, move pivot one right

	if (!hasNonZero) {
		reducedRowEchelon(matrix, i, j+1);
	}
	else {

		// Finds first nonzero row and permutes with pivot position

		for (let x = i; x < matrix.length; x++) {
			console.log(matrix);
			console.log(i + ' ' + j);
			if (!(fraction.isNonZero(matrix[i][j])) && (fraction.isNonZero(matrix[x][j]))) {
				console.log("Permuting rows: " + i + " and " + x);
				matrix = operations.permuteRowOperation(matrix, i, x);
				printMatrix(matrix);
				break;
			}
		}

		// Multiplies the row by reciprocal of pivot point

		if (((fraction.getDecimal(matrix[i][j])) !== 1) && ((fraction.getDecimal(matrix[i][j])) !== 0)) {
			console.log("Scaling row: " + (i+1));
			console.log("Before inverse: " + matrix[i][j].num + " " + matrix[i][j].den);
			matrix = operations.scalarOperation(matrix, i, fraction.invertFraction(matrix[i][j]));
			printMatrix(matrix);
		}

		// Adds multiple of pivot position to other rows

		for (let x = 0; x < matrix.length; x++) {
			if ((x !== i) && (fraction.isNonZero(matrix[x][j])) && (fraction.isNonZero(matrix[i][j])) && (j < matrix[0].length)) {
				console.log("Row Replacement to row: " + (x+1));
				let product = fraction.multiplyFraction(matrix[i][j], matrix[x][j]);
				matrix = operations.rowReplacementOperation(matrix, i, x, fraction.negateFraction(product));
				printMatrix(matrix);
			}
		}

		reducedRowEchelon(matrix, i+1, j+1);
	}	
}

/*
 * Solves an augmented matrix. Implemented recursively.
 * No return value - uses reference.
 */

function reducedRowEchelonAugmented(matrix, i, j) {
	console.log("reducing augmented!");

	// End iterations if at right end of matrix

	if ((j >= matrix[0].length - 1) || (i >= matrix.length)) {
		console.log("Finished! Returning.")
		return;
	}

	// Checks if the pivot and down is all zero

	let hasNonZero = false;
	for (let x = i; x < matrix.length; x++) {
		if (fraction.isNonZero(matrix[x][j])) {
			hasNonZero = true;
		}
	}

	if (!hasNonZero) {
		reducedRowEchelonAugmented(matrix, i, j+1);
	}
	else {

		// Finds first nonzero row and permutes with pivot position

		for (let x = i; x < matrix.length; x++) {
			if (!(fraction.isNonZero(matrix[i][j])) && (fraction.isNonZero(matrix[x][j]))) {
				console.log("Permuting rows: " + i + " and " + x);
				matrix = operations.permuteRowOperation(matrix, i, x);
				printMatrix(matrix);
				break;
			}
		}

		// Multiplies the row by reciprocal of the pivot point

		if (((fraction.getDecimal(matrix[i][j])) != 1) && ((fraction.getDecimal(matrix[i][j])) != 0)) {
			matrix = operations.scalarOperation(matrix, i, fraction.invertFraction(matrix[i][j]));
			printMatrix(matrix);
		}

		// Adds multiple of pivot position to other rows

		for (let x = 0; x < matrix.length; x++) {
			if ((x !== i) && (fraction.isNonZero(matrix[x][j])) && (fraction.isNonZero(matrix[i][j])) && (j < matrix[0].length)) {
				console.log("Row Replacement to row: " + (x+1));
				let product = fraction.multiplyFraction(matrix[i][j], matrix[x][j]);
				matrix = operations.rowReplacementOperation(matrix, i, x, fraction.negateFraction(product));
				printMatrix(matrix);
			}
		}

		reducedRowEchelonAugmented(matrix, i+1, j+1);
	}	
}

/* ------------ Determinant Operations ------------ */

var multiplicity = new frac(1, 1);

function calculateDeterminant(matrix) {
	multiplicity = new frac(1, 1);
	reducedRowEchelonDeterminant(matrix, 0, 0, multiplicity);
	return multiplicity;
}

function reducedRowEchelonDeterminant(matrix, i, j) {

	// End iterations if at right end of matrix

	if ((i >= matrix.length) || (j >= matrix[0].length)) {
		console.log("Finished! Returning Determinant.")
		return;
	}

	// Checks if the pivot and down is all zero

	let hasNonZero = false;

	for (let x = 0; x < matrix.length; x++) {
		if (fraction.isNonZero(matrix[x][j])) {
			hasNonZero = true;
		}
	}
	if (!hasNonZero) {
		fraction.multiplyFraction(multiplicity, new frac(0,1));
		return;
	}
	else {

		// Finds first nonzero row and permutes with pivot position

		for (let x = i; x < matrix.length; x++) {
			if (!(fraction.isNonZero(matrix[i][j])) && (fraction.isNonZero(matrix[x][j]))) {
				console.log("Permuting rows: " + i + " and " + x);
				multiplicity = fraction.multiplyFraction(multiplicity, new frac(-1, 1));
				matrix = operations.permuteRowOperation(matrix, i, x);
				printMatrix(matrix);
				break;
			}
		}

		// Multiplies the row by reciprocal of pivot point

		if (((fraction.getDecimal(matrix[i][j])) !== 1) && ((fraction.getDecimal(matrix[i][j])) !== 0)) {
			console.log("Scaling row: " + (i+1));
			multiplicity = fraction.multiplyFraction(multiplicity, matrix[i][j]);
			console.log("\nmultiplicity" + multiplicity);
			matrix = operations.scalarOperation(matrix, i, fraction.invertFraction(matrix[i][j]));
			printMatrix(matrix);
		}

		// Adds multiple of pivot point to other rows

		for (let x = 0; x < matrix.length; x++) {
			if ((x !== i) && (fraction.isNonZero(matrix[x][j])) && (fraction.isNonZero(matrix[i][j])) && (j < matrix[0].length)) {
				console.log("Row Replacement to row: " + (x+1));
				let product = fraction.multiplyFraction(matrix[i][j], matrix[x][j]);
				matrix = operations.rowReplacementOperation(matrix, i, x, fraction.negateFraction(product));
				printMatrix(matrix);
			}
		}
		if (matrix[j][j].num === 0) {
			multiplicity = fraction.multiplyFraction(multiplicity, new frac(0,1));
			return;
		}

		reducedRowEchelonDeterminant(matrix, i+1, j+1, multiplicity);
	}	
}

/* ------------ Matrix Rank / Span Functions ------------ */

/*
 * Given a matrix, returns a matrix of the rows that form a basis
 */

function matrixColumnSpace(matrix) {
	let matrixCopy = copyMatrix(matrix);
	let pivots = getPivots(matrixCopy);

	console.log(pivots);	

	let newMatrix = []; // matrix of frac objects

	for (let x = 0; x < matrix.length; x++) {
		let rowArr = [];
		let pivotTally = 0;
		for (let y = 0; y < matrix[0].length; y++) {
			if (y === pivots[pivotTally]) {
				rowArr.push(matrix[x][y]);
				pivotTally++;
			}
		}
		newMatrix.push(rowArr);
	}

	printMatrix(newMatrix);

	return newMatrix;
}

/*
 * Returns a matrix consisting of only the row basis vectors
 */

function matrixRowSpace(matrix) {
	let matrixCopy = copyMatrix(matrix);
	let pivots = getPivots(matrixCopy);

	console.log(pivots);	
	let newMatrix = [];
	for (let x = 0; x < pivots.length; x++) {
		let rowArr = [];
		for (let y = 0; y < matrixCopy[0].length; y++) {
			console.log("length" + matrixCopy[0].length);
			rowArr.push(matrixCopy[x][y]);
		}
		newMatrix.push(rowArr);
	}

	return newMatrix;
}

/*
 * Returns a new matrix that represents the basis vectors of the nullspace.
 */


function matrixNullspace(matrix) {
	let matrixCopy = copyMatrix(matrix);
	reducedRowEchelon(matrixCopy, 0, 0);
	let pivots = getPivots(matrixCopy);

	console.log(pivots);

	let newMatrix = [];
	let pivotTally = 0;
	let nonPivotTally = 0;

	let x = 0;
	while (x < matrixCopy[0].length) {
		let rowArr = [];

		if (pivots.includes(x)) {
			console.log("top iteration " + x);
			for (let y = 0; y < matrixCopy[0].length; y++) {
				if (!pivots.includes(y)) {
					rowArr.push(fraction.negateFraction(matrixCopy[pivotTally][y]));
				}
			}
			pivotTally++;
		}
		else if (!pivots.includes(x)) {
			console.log("bottom iteration " + x);
			for (let y = 0; y < (matrixCopy[0].length - pivots.length); y++) {
				if (y === nonPivotTally) {
					rowArr.push(new frac(1, 1));
				}
				else {
					rowArr.push(new frac(0, 1));
				}
			}
			nonPivotTally++;
		}

		x++;
		newMatrix.push(rowArr);
	}

	console.log("done.");
	console.log(newMatrix);

	return newMatrix;
}

/* ------------ Vector Space Operations ------------ */

/*
 * Given a matrix, will perform the gram-schmidt process and return
 * a set of orthogonal vectors.
 */

function gramSchmidtProcess(matrix) {

	// Transpose so we can operate on vectors as rows
	console.log("test");6

	let vectors = getTranspose(matrix);
	console.log("printing vectors");
	console.log(vectors);

	console.log("")

	for (let x = 0; x < vectors.length; x++) {
		for (let y = 0; y < x; y++) {
			console.log(x);
			vectors[x] = vector.subtractVector(vectors[x], vector.projectVector(vectors[x], vectors[y]));
		}
	}

	// Transpose back to regular matrix

	return getTranspose(vectors);
}


/* ------------ Matrix Format Functions ------------ */

/*
 * Converts the input matrix into a matrix of frac objects
 */

function convertInput(matrix) {
	for (let x = 0; x < matrix.length; x++) {
		for (let y = 0; y < matrix[0].length; y++) {
			matrix[x][y] = new frac(matrix[x][y], 1);
		}
	}
}

function printMatrix(matrix) {
	for (let x = 0; x < matrix.length; x++) {
		for (let y = 0; y < matrix[0].length; y++) {
			if (matrix[x][y].den === 1 || matrix[x][y].den === -1) {
				process.stdout.write(matrix[x][y].num + "\t\t");
			}
			else {
				process.stdout.write(matrix[x][y].num + "/" + matrix[x][y].den + "\t");
			}
		}
		console.log();
	}
	console.log();
}

/*
 * Returns a copy of the matrix
 */

function copyMatrix(matrix) {
	let matrixCopy = [];
	for (let x = 0; x < matrix.length; x++) {
		let newArr = [];
		for (let y = 0; y < matrix[0].length; y++) {
			let tempFrac = new frac(matrix[x][y].num, matrix[x][y].den);
			newArr.push(tempFrac);
		}
		matrixCopy.push(newArr);
	}

	return matrixCopy;
}

/*
 * Returns a transposed matrix
 */

function getTranspose(matrix) {
	let matrixCopy = copyMatrix(matrix);
	let newMatrix = [];

	for (let x = 0; x < matrixCopy[0].length; x++) {
		let rowArr = [];
		for (let y = 0; y < matrix.length; y++) {
			rowArr.push(matrixCopy[y][x]);
		}
		newMatrix.push(rowArr);
	}

	return newMatrix;
}

/*
 * Returns an array of 0-indexed pivot positions
 */

function getPivots(matrix) {
	reducedRowEchelon(matrix, 0, 0);
	let pivots = [];

	let i = 0; // rows
	let j = 0; // cols
	while ((i < matrix.length) && (j < matrix[0].length)) {
		if ((matrix[i][j].num === 1) && (matrix[i][j].den === 1)) { // move 1 right 1 down
			pivots.push(j);
			i++;
			j++;
		}
		else { // move 1 right only
			j++;
		}
	}

	return pivots;
}

export default {
	reducedRowEchelon: reducedRowEchelon,
	reducedRowEchelonAugmented: reducedRowEchelonAugmented,
	calculateDeterminant: calculateDeterminant,
	matrixColumnSpace: matrixColumnSpace,
	matrixRowSpace: matrixRowSpace,
	matrixNullspace: matrixNullspace,
	gramSchmidtProcess: gramSchmidtProcess,
	convertInput: convertInput,
	printMatrix: printMatrix,
	copyMatrix: copyMatrix,
	getTranspose: getTranspose,
	getPivots: getPivots
}