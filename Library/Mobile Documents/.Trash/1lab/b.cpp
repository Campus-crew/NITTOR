#include <iostream>
#include <stack>
#include <deque>
#include <vector>
using namespace std;
int main(){
    int num;
    cin>>num;
    vector <int> v;
    int min=0;
    for(int i=0;i<num;i++){
        int n;
        cin>>n;
        v.push_back(n);
    }
    
    // vector <int> v1(num), v2(num,-1);
    // for(int i=0;i<num;i++){
    //     cin>>v1[i];
    // }
    // stack <int> st;
    // for(int i=0;i<num;i++){
    //     while(!st.empty()&& st.top()>v1[i]){
    //         st.pop();
    //     }
    //     if(st.empty()){
    //         v2[i]=-1;
    //     }else{
    //         v2[i]=st.top();
    //     }
    //     st.push(v1[i]);
    // }
    // for(int i=0;i<v2.size();i++){
    //     cout<<v2[i]<<" ";
    // }
    
}