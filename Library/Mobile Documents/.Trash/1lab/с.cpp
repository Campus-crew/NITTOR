#include <iostream>
#include <string>
using namespace std;

int main(){
    string s1, s2;
    cin>>s1>>s2;
    string a;
    for(int i=0;i<s1.size();i++){
        if(s1[i] == '#'){
            if(!a.empty()){
                a.pop_back();
            }
        }else{
            a.push_back(s1[i]);
        }
    }
    string b;
    for(int i=0;i<s2.size();i++){
        if(s2[i] == '#'){
            if(!b.empty()){
                b.pop_back();
            }
        }else{
            b.push_back(s2[i]);
        }
    }
    if(a==b){
        cout<<"Yes";
    }else{
        cout<<"No";
    }
}