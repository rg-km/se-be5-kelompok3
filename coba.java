import java.util.Scanner;
 
public class coba {
    public static void main(String args[])
    {
        // inisialisasi Fungsi
        Scanner input = new Scanner(System.in);
        // deklarasi variabel
        int bilangan, starts, ends;
 
        // main menu Program
        System.out.println("Program Menampilkan Deret Bilangan Prima");
        System.out.print("Start From: ");
        starts = input.nextInt();
        System.out.print("End: ");
        ends = input.nextInt();
        System.out.println("------------------------------------------");
 
        for (int i=starts; i<=ends; i++)
        {
            bilangan=0;
            for (int j=1; j<=i; j++)
            {
                if (i%j==0)
                {
                    bilangan++;
                }
            }
            if (bilangan==2)
            {
                System.out.print(i+" ");
            }
        }
    }
}