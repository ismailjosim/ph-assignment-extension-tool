Question1

function sumArray(arr){
    s=0;
    for (i=0;i<arr.length;i++){
        s+=arr[i];
    }
    return s;
}
const arr = [1, 2, 3, 4, 5];
const sum = sumArray(arr);
console.log(sum);

Question 2

function findMaxNumber(arr){
    max = arr[0];
    for (i=0;i<arr.length;i++){
        if (max < arr[i]){
            max = arr[i];
        }
    }
    return max;
}
const arr = [10, 5, 8, 20, 3];
const maxNumber = findMaxNumber(arr);
console.log(maxNumber);

Question3

function filterOddNumbers(arr){
    odd_nos = [];
    for (i=0;i<arr.length;i++){
        if (arr[i] % 2 != 0){
            odd_nos.push(arr[i]);
        }
    }
    return odd_nos;
}

const arr = [1, 2, 3, 4, 5];
const oddNumbers = filterOddNumbers(arr);
console.log(oddNumbers);

Question4

function isPalindrome(str){
    s1 = str.toLowerCase();
    s2 = "";
    for (i=(s1.length-1);i>=0; i--){
        s2+=s1[i];
    }
    if (s1 == s2){
        return true;
    }
    else{
        return false;
    }
}
const isPalindromeResult = isPalindrome('radar');
const isNonPalindromeResult = isPalindrome('hello');

console.log(isPalindromeResult);
console.log(isNonPalindromeResult);

Question5

function findMissingNumber(arr){
    j=1;
    for(i=0;i<arr.length;i++){
        if (arr[i] != j){
            return j;
        }
        j++;
    }
}
const arr = [1, 2, 3, 5, 6];
const missingNumber = findMissingNumber(arr);
console.log(missingNumber);

Question6

function findDuplicates(arr){
    let newArray=[];
    for (i=0;i<arr.length;i++){
        for (j=i+1;j<arr.length;j++){
            if(arr[i]==arr[j]){
                newArray.push(arr[i]);

            }
        }
    }
    return newArray;
}
const arr = [1, 2, 3, 2, 4, 5, 4, 6];
const duplicateNumbers = findDuplicates(arr);
console.log(duplicateNumbers);