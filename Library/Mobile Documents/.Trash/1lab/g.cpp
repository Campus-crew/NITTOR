#include <iostream>
using namespace std;
bool isitprime(int num){
    if(num<2)return false;
    for(int i=2;i*i<=num;i++){
        if(num%i==0) return false;
    }
    return true;
}
int cnt(int n){
    int i = 2;
    while(n){
        if(isitprime(i))
            n--;
        i++;
    }

    return i-1;
}

int main(){
    int num;
    cin>>num;
    cout << cnt(cnt(num));
}
