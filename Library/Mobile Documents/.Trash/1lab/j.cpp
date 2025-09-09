#include <iostream>
#include <deque>
#include <algorithm>
using namespace std;
int main(){
    deque <int> dq;
    char s;
    while(cin>>s){
        if(s == '+'){
            int num;
            cin>>num;
            dq.push_front(num);
        }else if (s == '-'){
            int num;
            cin>>num;
            dq.push_back(num);
        } else if ( s=='*'){
            if(dq.empty()){
                cout<<"error"<<endl;
            }else {
                int sum=dq.front()+dq.back();
                dq.pop_front();
                if (!dq.empty()){
                    dq.pop_back();
                }
                cout<<sum<<endl;
            }
        }else if(s=='!'){
            break;
        }
    }
    return 0;
}
