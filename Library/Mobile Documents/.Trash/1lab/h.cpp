#include <iostream>
#include <string>
using namespace std;
int main(){
    int num;
    cin>>num;
    bool prime=true;
    if (num<=1){
        prime=false;
    }
    for (int i=2; i*i<=num ;++i){
        if(num % i ==0){
            prime=false;
            break;
        }
    }
    if(prime){
        cout<<"YES";
    }else{
        cout<<"NO";
    }
}