#include <iostream>
#include <string>
#include <stack>
#include <map>
using namespace std;

int main(){
    string s;
    cin>>s;
    stack <char> c;
    for(int i=0;i<s.size();i++){
        if(!c.empty()&&c.top() == s[i]){
            c.pop();
        }else{
            c.push(s[i]);
        }
    }
    if(c.empty()){
        cout<<"YES"; 
    }else{
        cout<<"NO";
    }
}