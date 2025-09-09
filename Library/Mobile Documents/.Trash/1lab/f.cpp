#include <iostream>
#include <string>
#include <stack>
#include <map>
using namespace std;
int main(){
    int num;
    cin>>num;
    int count=0;
    int n=2;
    while(count<num){
       bool prime=true;
       for (int i=2; i*i<=n ;++i){
            if(n % i ==0){
                prime=false;
                break;
            }
        }
        if(prime){
            count++;
        }
        if(count<num){
            n++;
        }
    }
    cout<<n;
    return 0;
}