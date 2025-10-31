//using Microsoft.EntityFrameworkCore;
//using MoviesAndStuff.Api.Data;

//namespace MoviesAndStuff.Api.Tests.Helpers
//{
//    public static class MockDbContextFactory
//    {
//        public static AppDbContext CreateInMemoryContext(string databaseName = null)
//        {
//            var options = new DbContextOptionsBuilder<AppDbContext>()
//                 .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString())
//                 .Options; 

//            return new AppDbContext(options);
//        }
//    }
//}
