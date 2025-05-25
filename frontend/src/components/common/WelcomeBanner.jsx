const WelcomeBanner = ({ user }) => {
  return (
    <div className="welcome-banner">
      <h1>
        {user 
          ? `Welcome back, ${user.name.split(' ')[0]}!` 
          : 'Discover Amazing Events'}
      </h1>
      <p>
        {user
          ? 'Check out these upcoming events in your area'
          : 'Sign up to book tickets for your favorite events'}
      </p>
    </div>
  );
};

export default WelcomeBanner;