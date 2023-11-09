// #include <math.h>

// extern "C" {

//   int int_sqrt(int x) {
//     return sqrt(x);
//   }
// }

#include <stdio.h>
#include <emscripten/emscripten.h>

extern "C" {int addNums (float *buf, int bufSize) {

    int total = 0;

    for (int i=0; i<bufSize; i++) {
        total+= buf[i];
    }

    return total;
}}





// #include <math.h>
// #include<array>

// extern "C" {

// std::array<int,5000> int_sqrt(int x) {
//     std::array<int,5000> f_array; //array declared
    
// 	for(int i=0;i<5000;i++)
// 	{
// 		//array initialisation
// 		f_array[i] = i * x;
// 	}

//     return f_array; //array returned
//   }
// }