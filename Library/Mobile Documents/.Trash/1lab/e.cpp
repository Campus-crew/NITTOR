#include <iostream>
#include <deque>
using namespace std;
int main(){
    deque <int> boris;
    deque <int> nursik;
    int n=5;
    int c;
    for(int i=0; i<n; i++){
        cin>>c;
        boris.push_back(c);
    }
    for(int i=0; i<n; i++){
        cin>>c;
        nursik.push_back(c);
    }
    int count=0;
    while(!nursik.empty() && !boris.empty() && count<1000){
        count++;
        int b=boris.front();
        boris.pop_front();
        int n=nursik.front();
        nursik.pop_front();
        if((b > n && !(b == 9 && n == 0)) || (b == 0 && n == 0)){
            boris.push_back(b);
            boris.push_back(n);
        }else{
            nursik.push_back(b);
            nursik.push_back(n);
        }
    }
    if(boris.empty()){
        cout<<"Nursik"<<" "<<count;
    }else if(nursik.empty()){
        cout<<"Boris"<<" "<<count;
    }else{
        cout<<"blin nechya";
    }
}