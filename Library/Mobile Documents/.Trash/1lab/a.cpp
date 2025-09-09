#include <iostream>
#include <stack>
#include <deque>
#include <vector>
using namespace std;
int main(){
    deque <int> dq;
    int n;
    cin>>n;
    for(int i=n;i>=1;i--){
        dq.push_front(i);
        for(int j=i;j<=i;j++){
            int t=dq.push_back(j);
            dq.pop_back()

        }
    }
}
